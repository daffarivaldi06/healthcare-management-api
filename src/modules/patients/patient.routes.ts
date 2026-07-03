import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient
} from './patient.controller';
import {
  createPatientSchema,
  listPatientsSchema,
  patientIdSchema,
  updatePatientSchema
} from './patient.validation';

const router = Router();

/**
 * @openapi
 * /api/patients:
 *   post:
 *     summary: Create a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientRequest'
 *     responses:
 *       201:
 *         description: Patient created
 *   get:
 *     summary: List patients with pagination and search
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Patients returned
 */
router
  .route('/')
  .post(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), validate(createPatientSchema), createPatient)
  .get(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(listPatientsSchema), getPatients);

/**
 * @openapi
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient returned
 *   patch:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient updated
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Patient deleted
 */
router
  .route('/:id')
  .get(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(patientIdSchema), getPatientById)
  .patch(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), validate(patientIdSchema.merge(updatePatientSchema)), updatePatient)
  .delete(authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), validate(patientIdSchema), deletePatient);

export const patientRoutes = router;
