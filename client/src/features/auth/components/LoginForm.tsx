'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';
import Link from 'next/link';

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">ელ-ფოსტა</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@mail.com"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'შესვლა...' : 'შესვლა'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        არ გაქვთ ანგარიში?{' '}
        <Link href="/register" className="text-primary hover:underline">
          რეგისტრაცია
        </Link>
      </p>
    </form>
  );
};
