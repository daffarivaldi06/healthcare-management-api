import { Gender } from '@prisma/client';
import { z } from 'zod';

const patientBody = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.coerce.date(),
  gender: z.nativeEnum(Gender),
  phone: z.string().min(5),
  address: z.string().min(3),
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().min(5),
  medicalRecordNumber: z.string().min(3)
});

export const createPatientSchema = z.object({ body: patientBody });
export const updatePatientSchema = z.object({ body: patientBody.partial() });

export const patientIdSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export const listPatientsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});
