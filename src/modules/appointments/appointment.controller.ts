import { StatusCodes } from 'http-status-codes';
import { UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { createAuditLog } from '../auditLogs/auditLog.service';

export const createAppointment = asyncHandler(async (req, res) => {
  const doctor = await prisma.user.findUnique({ where: { id: req.body.doctorId } });

  if (!doctor || doctor.role !== UserRole.DOCTOR) {
    throw new AppError('doctorId must reference an existing doctor', StatusCodes.BAD_REQUEST);
  }

  const appointment = await prisma.appointment.create({
    data: req.body,
    include: {
      patient: true,
      doctor: { select: { id: true, name: true, email: true, role: true } }
    }
  });

  await createAuditLog({
    userId: req.user?.id,
    action: 'APPOINTMENT_CREATED',
    entityType: 'Appointment',
    entityId: appointment.id
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: appointment });
});

export const getAppointments = asyncHandler(async (_req, res) => {
  const appointments = await prisma.appointment.findMany({
    orderBy: { scheduledAt: 'asc' },
    include: {
      patient: true,
      doctor: { select: { id: true, name: true, email: true, role: true } }
    }
  });

  res.status(StatusCodes.OK).json({ success: true, data: appointments });
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: {
      patient: true,
      doctor: { select: { id: true, name: true, email: true, role: true } }
    }
  });

  if (!appointment) {
    throw new AppError('Appointment not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true, data: appointment });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
    include: {
      patient: true,
      doctor: { select: { id: true, name: true, email: true, role: true } }
    }
  });

  res.status(StatusCodes.OK).json({ success: true, data: appointment });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  await prisma.appointment.delete({ where: { id: req.params.id } });
  res.status(StatusCodes.NO_CONTENT).send();
});
