import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { config } from '../config/env';

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: 'shipper' | 'driver' | 'admin';
  // Shipper specific
  companyName?: string;
  contactPhone?: string;
  // Driver specific
  fullName?: string;
  phone?: string;
  truckType?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterUserData) {
    const { name, email, password, role } = data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario con rol específico
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(role === 'shipper' && {
          shipper: {
            create: {
              companyName: data.companyName || '',
              contactPhone: data.contactPhone || '',
            },
          },
        }),
        ...(role === 'driver' && {
          driver: {
            create: {
              fullName: data.fullName || name,
              phone: data.phone || '',
              truckType: data.truckType,
            },
          },
        }),
      },
      include: {
        shipper: true,
        driver: true,
      },
    });

    // Generar token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shipper: user.shipper,
        driver: user.driver,
      },
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        shipper: true,
        driver: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shipper: user.shipper,
        driver: user.driver,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        shipper: true,
        driver: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      shipper: user.shipper,
      driver: user.driver,
    };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const secret: jwt.Secret = config.jwtSecret;
    const expiresIn: jwt.SignOptions['expiresIn'] =
      config.jwtExpiresIn as jwt.SignOptions['expiresIn'];
    const options: jwt.SignOptions = { expiresIn };

    return jwt.sign({ userId, email, role }, secret, options);
  }
}
