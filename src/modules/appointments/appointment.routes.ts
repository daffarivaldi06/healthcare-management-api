import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointmentStatus
} from './appointment.controller';
import {
  appointmentIdSchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema
} from './appointment.validation';

const router = Router();

/**
 * @openapi
 * /api/appointments:
 *   post:
 *     summary: Create appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentRequest'
 *     responses:
 *       201:
 *         description: Appointment created
 *   get:
 *     summary: List appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments returned
 */
router
  .route('/')
  .post(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(createAppointmentSchema), createAppointment)
  .get(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), getAppointments);

/**
 * @openapi
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointment returned
 *   delete:
 *     summary: Delete appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Appointment deleted
 */
router
  .route('/:id')
  .get(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(appointmentIdSchema), getAppointmentById)
  .delete(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), validate(appointmentIdSchema), deleteAppointment);

/**
 * @openapi
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "status": "COMPLETED" }
 *     responses:
 *       200:
 *         description: Appointment status updated
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR),
  validate(appointmentIdSchema.merge(updateAppointmentStatusSchema)),
  updateAppointmentStatus
);

export const appointmentRoutes = router;
