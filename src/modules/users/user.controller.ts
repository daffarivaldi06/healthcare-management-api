import { StatusCodes } from 'http-status-codes';
import { UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { asyncHandler } from '../../utils/asyncHandler';

export const getDoctors = asyncHandler(async (_req, res) => {
  const doctors = await prisma.user.findMany({
    where: { role: UserRole.DOCTOR },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: 'asc' }
  });

  res.status(StatusCodes.OK).json({ success: true, data: doctors });
});
