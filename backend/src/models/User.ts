import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  role: 'admin' | 'moderator' | 'user';
}

export class User {
  static async findOne(query: { email?: string; username?: string }): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: query.email },
          { username: query.username }
        ]
      }
    });
    return user;
  }

  static async create(data: { email: string; username: string; password: string; role?: string }): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role || 'user'
      }
    });
    return user;
  }

  static async comparePassword(user: IUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }
} 