import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { comparePassword, hashPassword } from '../../utils/password';
import { signAccessToken } from '../../utils/jwt';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('Email is already registered', StatusCodes.CONFLICT);
  }

  const user = await prisma.user.create({
    data: { name, email, role, passwordHash: await hashPassword(password) },
    select: publicUserSelect
  });

  const token = signAccessToken({ userId: user.id, role: user.role });

  res.status(StatusCodes.CREATED).json({ success: true, data: { user, token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const token = signAccessToken({ userId: user.id, role: user.role });

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  });
});
