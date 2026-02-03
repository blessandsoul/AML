import { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors';
import { errorResponse } from '../shared/helpers';

export async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError | Error, request, reply) => {
    // Log error
    fastify.log.error(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const message = error.issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join(', ');
      return reply.status(400).send(errorResponse('VALIDATION_ERROR', message));
    }

    // Handle AppError (our custom errors)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(errorResponse(error.code, error.message));
    }

    // Handle Fastify validation errors
    if ('validation' in error && error.validation) {
      return reply.status(400).send(errorResponse('VALIDATION_ERROR', error.message));
    }

    // Handle Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as any;

      if (prismaError.code === 'P2002') {
        return reply.status(409).send(errorResponse('DUPLICATE_ENTRY', 'A record with this value already exists'));
      }

      if (prismaError.code === 'P2025') {
        return reply.status(404).send(errorResponse('NOT_FOUND', 'Record not found'));
      }
    }

    // Handle unknown errors
    const statusCode = 'statusCode' in error ? (error.statusCode as number) : 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;

    return reply.status(statusCode).send(errorResponse('INTERNAL_ERROR', message));
  });
}
