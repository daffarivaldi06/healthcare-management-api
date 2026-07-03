import jwt, { type SignOptions } from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as JwtPayload;
