import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  token: string;
}

interface ErrorResponse {
  message: string;
}

type ResponseType = AuthResponse | ErrorResponse;

const router = express.Router();

// Register route
const register = async (req: Request<{}, ResponseType, RegisterRequest>, res: Response<ResponseType>) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken' 
      } as ErrorResponse);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'user'
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    } as AuthResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    } as ErrorResponse);
  }
};

// Login route
const login = async (req: Request<{}, ResponseType, LoginRequest>, res: Response<ResponseType>) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ 
        message: 'Invalid credentials' 
      } as ErrorResponse);
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        message: 'Invalid credentials' 
      } as ErrorResponse);
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    } as AuthResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    } as ErrorResponse);
  }
};

router.post('/register', register);
router.post('/login', login);

export default router; 