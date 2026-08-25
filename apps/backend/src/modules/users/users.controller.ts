import { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { registerUserSchema } from './dto/register-user.dto.js';
import { loginUserSchema } from './dto/login-user.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { z } from 'zod';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validar el cuerpo de la petición mediante Zod DTO
      const validatedData = registerUserSchema.parse(req.body);

      // 2. Delegar la creación al servicio de negocio
      const newUser = await this.usersService.register(validatedData);

      // 3. Responder con código 201 (Created)
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        data: newUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Error de validación en los datos de entrada',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validar credenciales de entrada
      const validatedData = loginUserSchema.parse(req.body);

      // 2. Autenticar usuario y obtener JWT
      const result = await this.usersService.login(validatedData);

      // 3. Responder con código 200 (OK)
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Error de validación en los datos de entrada',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // Retorna el usuario decodificado desde el Token JWT en el middleware
      res.status(200).json({
        message: 'Perfil de usuario obtenido correctamente',
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener perfil del usuario' });
    }
  };

  refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.sub) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      // Renovar token usando el ID decodificado en req.user
      const result = await this.usersService.refreshToken(req.user.sub);

      res.status(200).json({
        message: 'Sesión extendida correctamente',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error al extender la sesión' });
    }
  };
}