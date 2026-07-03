import { DocumentType } from '@prisma/client';
import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    content: z.string().min(5),
    type: z.nativeEnum(DocumentType),
    patientId: z.string().uuid()
  })
});

export const patientDocumentsSchema = z.object({
  params: z.object({ patientId: z.string().uuid() })
});
