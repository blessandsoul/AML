import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';
import type { MultipartFile } from '@fastify/multipart';
import { env, allowedFileTypes } from '../config/env.js';
import { BadRequestError } from './errors.js';
import { logger } from './logger.js';

/**
 * Uploaded file info
 */
export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

/**
 * Ensure upload directory exists
 */
export function ensureUploadDir(subdir = ''): string {
  const dir = join(process.cwd(), env.UPLOAD_DIR, subdir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Generate unique filename while preserving extension
 */
export function generateFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase();
  return `${randomUUID()}${ext}`;
}

/**
 * Validate file type
 */
export function validateFileType(mimetype: string): boolean {
  return allowedFileTypes.includes(mimetype);
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): boolean {
  return size <= env.MAX_FILE_SIZE;
}

/**
 * Save uploaded file to disk
 */
export async function saveFile(
  file: MultipartFile,
  subdir = ''
): Promise<UploadedFile> {
  // Validate file type
  if (!validateFileType(file.mimetype)) {
    throw new BadRequestError(
      `File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`,
      'INVALID_FILE_TYPE'
    );
  }

  // Generate unique filename
  const filename = generateFilename(file.filename);
  const uploadDir = ensureUploadDir(subdir);
  const filePath = join(uploadDir, filename);

  // Save file
  const writeStream = createWriteStream(filePath);

  try {
    await pipeline(file.file, writeStream);

    // Get file size after save
    const size = writeStream.bytesWritten;

    // Validate file size
    if (!validateFileSize(size)) {
      // Delete the file if too large
      unlinkSync(filePath);
      throw new BadRequestError(
        `File too large. Maximum size: ${env.MAX_FILE_SIZE / 1024 / 1024}MB`,
        'FILE_TOO_LARGE'
      );
    }

    // Build relative path and URL
    const relativePath = subdir ? `${subdir}/${filename}` : filename;
    const url = `${env.STATIC_URL_PREFIX}/${relativePath}`;

    return {
      filename,
      originalName: file.filename,
      mimetype: file.mimetype,
      size,
      path: relativePath,
      url,
    };
  } catch (error) {
    // Clean up on error
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    throw error;
  }
}

/**
 * Save multiple files
 */
export async function saveFiles(
  files: AsyncIterableIterator<MultipartFile>,
  subdir = ''
): Promise<UploadedFile[]> {
  const savedFiles: UploadedFile[] = [];

  for await (const file of files) {
    const saved = await saveFile(file, subdir);
    savedFiles.push(saved);
  }

  return savedFiles;
}

/**
 * Delete a file from disk
 */
export function deleteFile(relativePath: string): boolean {
  try {
    const fullPath = join(process.cwd(), env.UPLOAD_DIR, relativePath);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    logger.error({ error, path: relativePath }, 'Failed to delete file');
    return false;
  }
}

/**
 * Delete multiple files
 */
export function deleteFiles(relativePaths: string[]): void {
  for (const path of relativePaths) {
    deleteFile(path);
  }
}
