import { AppointmentStatus } from '@prisma/client';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    scheduledAt: z.coerce.date(),
    reason: z.string().optional()
  })
});

export const appointmentIdSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AppointmentStatus)
  })
});
