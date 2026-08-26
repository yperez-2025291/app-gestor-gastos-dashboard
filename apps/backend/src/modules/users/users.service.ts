import { prisma } from '../../database/prisma.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UsersService {
  async register(data: RegisterUserDto) {
    // 1. Verificar si el usuario ya existe por email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // 2. Hashear la contraseña de forma segura
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Crear el nuevo usuario en PostgreSQL (por defecto rol USER)
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  async login(data: LoginUserDto) {
    // 1. Buscar el usuario por su correo
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Comparar la contraseña ingresada con el hash en DB
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Generar el Token JWT con tipado explícito para las opciones
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    const signOptions: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1m',
    };

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      signOptions
    );

    // 4. Retornar los datos del usuario (sin password) y el token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async refreshToken(userId: string) {
    // 1. Verificar que el usuario siga existiendo en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Generar un nuevo Token JWT con un tiempo de expiración renovado
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    const signOptions: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d',
    };

    const newToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      signOptions
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: newToken,
    };
  }
}