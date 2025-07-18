import z from 'zod'

const passwordRules = z
  .string()
  .min(8, { message: 'Password minimal 8 karakter' })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial',
  })

export const LoginValidation = z.object({
  email: z.email().trim(),
  password: passwordRules,
})

export const RegisterValidation = z
  .object({
    firstName: z.string().trim().min(3, { message: 'First name wajib diisi' }),
    lastName: z.string().trim().optional(),
    email: z.email({ message: 'Format email tidak valid' }).trim(),
    password: passwordRules,
    confirmPassword: z.string(),
  })
  .refine(data => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak sama',
  })

  export const TaskValidation = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    assigneeId: z.string().nonempty(),
    status: z.enum(['todo', 'in-progress', 'done']),
  })

  export const ProjectValidation = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
  })
