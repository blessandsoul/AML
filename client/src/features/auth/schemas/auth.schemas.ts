import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('არასწორი ელ-ფოსტა'),
  password: z.string().min(1, 'პაროლი აუცილებელია'),
});

export const registerSchema = z
  .object({
    email: z.string().email('არასწორი ელ-ფოსტა'),
    password: z
      .string()
      .min(8, 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო')
      .regex(/[A-Z]/, 'პაროლი უნდა შეიცავდეს დიდ ასოს')
      .regex(/[a-z]/, 'პაროლი უნდა შეიცავდეს პატარა ასოს')
      .regex(/[0-9]/, 'პაროლი უნდა შეიცავდეს ციფრს'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'სახელი აუცილებელია').max(100).optional(),
    lastName: z.string().min(1, 'გვარი აუცილებელია').max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'პაროლები არ ემთხვევა',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
