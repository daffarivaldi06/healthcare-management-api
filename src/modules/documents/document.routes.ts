import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createDocument, getDocumentsByPatientId } from './document.controller';
import { createDocumentSchema, patientDocumentsSchema } from './document.validation';

const router = Router();

/**
 * @openapi
 * /api/documents:
 *   post:
 *     summary: Create a hospital document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentRequest'
 *     responses:
 *       201:
 *         description: Document created
 */
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(createDocumentSchema), createDocument);

/**
 * @openapi
 * /api/documents/patient/{patientId}:
 *   get:
 *     summary: Get documents by patient ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents returned
 */
router.get(
  '/patient/:patientId',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR),
  validate(patientDocumentsSchema),
  getDocumentsByPatientId
);

export const documentRoutes = router;
