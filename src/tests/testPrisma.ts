import { randomUUID } from 'crypto';
import { UserRole } from '@prisma/client';

type AnyRecord = Record<string, unknown>;
type AuthUserRecord = AnyRecord & { id: string; role: UserRole };

const users: AnyRecord[] = [];
const patients: AnyRecord[] = [];
const appointments: AnyRecord[] = [];
const auditLogs: AnyRecord[] = [];
const documents: AnyRecord[] = [];

const applySelect = (record: AnyRecord | null, select?: AnyRecord) => {
  if (!record || !select) return record;
  return Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, record[key]]));
};

const findByWhere = (collection: AnyRecord[], where: AnyRecord) =>
  collection.find((item) => Object.entries(where).every(([key, value]) => item[key] === value)) ?? null;

export const resetMockData = () => {
  users.length = 0;
  patients.length = 0;
  appointments.length = 0;
  auditLogs.length = 0;
  documents.length = 0;
};

export const mockPrisma = {
  user: {
    findUnique: jest.fn(async ({ where, select }) => applySelect(findByWhere(users, where), select)),
    findMany: jest.fn(async ({ where, select } = {}) =>
      users.filter((user) => !where?.role || user.role === where.role).map((user) => applySelect(user, select))
    ),
    create: jest.fn(async ({ data, select }) => {
      const user = { id: randomUUID(), createdAt: new Date(), updatedAt: new Date(), ...data };
      users.push(user);
      return applySelect(user, select);
    })
  },
  patient: {
    create: jest.fn(async ({ data }) => {
      const patient = { id: randomUUID(), createdAt: new Date(), updatedAt: new Date(), ...data };
      patients.push(patient);
      return patient;
    }),
    findMany: jest.fn(async ({ where, skip = 0, take = 10 } = {}) => {
      const search = where?.OR?.[0]?.fullName?.contains?.toLowerCase();
      const result = search
        ? patients.filter((patient) =>
            [patient.fullName, patient.phone, patient.medicalRecordNumber].some((value) =>
              String(value).toLowerCase().includes(search)
            )
          )
        : patients;
      return result.slice(skip, skip + take);
    }),
    count: jest.fn(async ({ where } = {}) => {
      const search = where?.OR?.[0]?.fullName?.contains?.toLowerCase();
      return search
        ? patients.filter((patient) => String(patient.fullName).toLowerCase().includes(search)).length
        : patients.length;
    }),
    findUnique: jest.fn(async ({ where }) => findByWhere(patients, where)),
    update: jest.fn(async ({ where, data }) => {
      const patient = findByWhere(patients, where);
      if (!patient) throw new Error('Patient not found');
      Object.assign(patient, data, { updatedAt: new Date() });
      return patient;
    }),
    delete: jest.fn(async ({ where }) => {
      const index = patients.findIndex((patient) => patient.id === where.id);
      return patients.splice(index, 1)[0];
    })
  },
  appointment: {
    create: jest.fn(async ({ data }) => {
      const appointment = {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'SCHEDULED',
        ...data,
        patient: findByWhere(patients, { id: data.patientId }),
        doctor: findByWhere(users, { id: data.doctorId })
      };
      appointments.push(appointment);
      return appointment;
    }),
    findMany: jest.fn(async () => appointments),
    findUnique: jest.fn(async ({ where }) => findByWhere(appointments, where)),
    update: jest.fn(async ({ where, data }) => {
      const appointment = findByWhere(appointments, where);
      if (!appointment) throw new Error('Appointment not found');
      Object.assign(appointment, data, { updatedAt: new Date() });
      return appointment;
    }),
    delete: jest.fn(async ({ where }) => {
      const index = appointments.findIndex((appointment) => appointment.id === where.id);
      return appointments.splice(index, 1)[0];
    })
  },
  hospitalDocument: {
    create: jest.fn(async ({ data }) => {
      const document = { id: randomUUID(), createdAt: new Date(), ...data };
      documents.push(document);
      return document;
    }),
    findMany: jest.fn(async ({ where }) => documents.filter((document) => document.patientId === where.patientId))
  },
  auditLog: {
    create: jest.fn(async ({ data }) => {
      const auditLog = { id: randomUUID(), timestamp: new Date(), ...data };
      auditLogs.push(auditLog);
      return auditLog;
    }),
    findMany: jest.fn(async () => auditLogs)
  },
  $disconnect: jest.fn()
};

export const seedMockUser = (user: AnyRecord): AuthUserRecord => {
  users.push({
    id: randomUUID(),
    name: 'Seed User',
    email: 'seed@example.com',
    role: UserRole.STAFF,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...user
  });
  return users[users.length - 1] as AuthUserRecord;
};

export const seedMockPatient = (patient: AnyRecord) => {
  patients.push({
    id: randomUUID(),
    fullName: 'Seed Patient',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'FEMALE',
    phone: '+628111111111',
    address: 'Jakarta',
    emergencyContactName: 'Emergency Contact',
    emergencyContactPhone: '+628222222222',
    medicalRecordNumber: `MRN-${randomUUID()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...patient
  });
  return patients[patients.length - 1];
};
