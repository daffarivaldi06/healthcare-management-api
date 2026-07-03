import { prisma } from '../../config/prisma';

interface AuditLogInput {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
}

export const createAuditLog = (data: AuditLogInput) =>
  prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId
    }
  });
