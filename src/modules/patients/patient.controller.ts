import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { getPagination } from '../../utils/pagination';
import { createAuditLog } from '../auditLogs/auditLog.service';

export const createPatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.create({ data: req.body });
  await createAuditLog({
    userId: req.user?.id,
    action: 'PATIENT_CREATED',
    entityType: 'Patient',
    entityId: patient.id
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: patient });
});

export const getPatients = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const search = req.query.search as string | undefined;
  const where: Prisma.PatientWhereInput = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { medicalRecordNumber: { contains: search, mode: 'insensitive' } }
        ]
      }
    : {};

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, fullName: true, dateOfBirth: true, gender: true, phone: true, medicalRecordNumber: true, createdAt: true
      }
    }),
    prisma.patient.count({ where })
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: patients,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: { appointments: true, documents: true }
  });

  if (!patient) {
    throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true, data: patient });
});

export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.update({ where: { id: req.params.id }, data: req.body });
  await createAuditLog({
    userId: req.user?.id,
    action: 'PATIENT_UPDATED',
    entityType: 'Patient',
    entityId: patient.id
  });

  res.status(StatusCodes.OK).json({ success: true, data: patient });
});

export const deletePatient = asyncHandler(async (req, res) => {
  await prisma.patient.delete({ where: { id: req.params.id } });
  res.status(StatusCodes.NO_CONTENT).send();
});
