import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/prisma';
import { asyncHandler } from '../../utils/asyncHandler';

export const getAuditLogs = asyncHandler(async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    take: 100
  });

  res.status(StatusCodes.OK).json({ success: true, data: logs });
});
