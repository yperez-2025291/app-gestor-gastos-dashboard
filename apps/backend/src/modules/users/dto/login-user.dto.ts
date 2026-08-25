import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;