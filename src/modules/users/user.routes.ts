import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { getDoctors } from './user.controller';

const router = Router();

/**
 * @openapi
 * /api/users/doctors:
 *   get:
 *     summary: List doctor users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctors returned
 */
router.get('/doctors', authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), getDoctors);

export const userRoutes = router;
