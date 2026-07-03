import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', StatusCodes.UNAUTHORIZED);
  }

  const payload = verifyAccessToken(header.replace('Bearer ', ''));
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true }
  });

  if (!user) {
    throw new AppError('Authenticated user no longer exists', StatusCodes.UNAUTHORIZED);
  }

  req.user = user;
  next();
});
