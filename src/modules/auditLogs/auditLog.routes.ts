import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { getAuditLogs } from './auditLog.controller';

const router = Router();

router.get('/', authenticate, authorize(UserRole.ADMIN), getAuditLogs);

export const auditLogRoutes = router;
