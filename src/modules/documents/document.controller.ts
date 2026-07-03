import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/prisma';
import { asyncHandler } from '../../utils/asyncHandler';
import { createAuditLog } from '../auditLogs/auditLog.service';

export const createDocument = asyncHandler(async (req, res) => {
  const document = await prisma.hospitalDocument.create({
    data: {
      ...req.body,
      createdBy: req.user!.id
    },
    include: {
      patient: true,
      creator: { select: { id: true, name: true, email: true, role: true } }
    }
  });

  await createAuditLog({
    userId: req.user?.id,
    action: 'DOCUMENT_CREATED',
    entityType: 'HospitalDocument',
    entityId: document.id
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: document });
});

export const getDocumentsByPatientId = asyncHandler(async (req, res) => {
  const documents = await prisma.hospitalDocument.findMany({
    where: { patientId: req.params.patientId },
    orderBy: { createdAt: 'desc' },
    include: { creator: { select: { id: true, name: true, email: true, role: true } } }
  });

  res.status(StatusCodes.OK).json({ success: true, data: documents });
});
