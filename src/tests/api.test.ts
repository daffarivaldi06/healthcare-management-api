import bcrypt from 'bcrypt';
import request from 'supertest';
import { UserRole } from '@prisma/client';
import { signAccessToken } from '../utils/jwt';
import { mockPrisma, resetMockData, seedMockPatient, seedMockUser } from './testPrisma';

jest.mock('../config/prisma', () => ({ prisma: mockPrisma }));

import { app } from '../app';

const patientPayload = {
  fullName: 'Alya Putri',
  dateOfBirth: '1992-04-15',
  gender: 'FEMALE',
  phone: '+628123456789',
  address: 'Jakarta, Indonesia',
  emergencyContactName: 'Budi Putra',
  emergencyContactPhone: '+628987654321',
  medicalRecordNumber: 'MRN-1001'
};

const authHeader = (user: { id: string; role: UserRole }) =>
  `Bearer ${signAccessToken({ userId: user.id, role: user.role })}`;

describe('Healthcare Management API', () => {
  beforeEach(() => {
    resetMockData();
    jest.clearAllMocks();
  });

  it('registers a user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'New Staff',
      email: 'new.staff@example.com',
      password: 'Password123!',
      role: 'STAFF'
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('new.staff@example.com');
    expect(response.body.data.token).toBeDefined();
  });

  it('logs in a user', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 4);
    seedMockUser({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'Password123!'
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe(UserRole.ADMIN);
    expect(response.body.data.token).toBeDefined();
  });

  it('creates a patient as staff', async () => {
    const staff = seedMockUser({ role: UserRole.STAFF, email: 'staff@example.com' });

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', authHeader(staff))
      .send(patientPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.fullName).toBe(patientPayload.fullName);
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
  });

  it('lists patients with pagination and search', async () => {
    const doctor = seedMockUser({ role: UserRole.DOCTOR, email: 'doctor@example.com' });
    seedMockPatient({ fullName: 'Alya Putri', medicalRecordNumber: 'MRN-1001' });
    seedMockPatient({ fullName: 'Rama Wijaya', medicalRecordNumber: 'MRN-1002' });

    const response = await request(app)
      .get('/api/patients?page=1&limit=10&search=Alya')
      .set('Authorization', authHeader(doctor));

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(1);
  });

  it('rejects patient creation for doctors', async () => {
    const doctor = seedMockUser({ role: UserRole.DOCTOR, email: 'doctor@example.com' });

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', authHeader(doctor))
      .send(patientPayload);

    expect(response.status).toBe(403);
  });

  it('creates an appointment', async () => {
    const staff = seedMockUser({ role: UserRole.STAFF, email: 'staff@example.com' });
    const doctor = seedMockUser({ role: UserRole.DOCTOR, email: 'doctor@example.com' });
    const patient = seedMockPatient({ fullName: 'Alya Putri', medicalRecordNumber: 'MRN-1001' });

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', authHeader(staff))
      .send({
        patientId: patient.id,
        doctorId: doctor.id,
        scheduledAt: '2026-06-10T09:00:00.000Z',
        reason: 'General consultation'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.patientId).toBe(patient.id);
    expect(response.body.data.doctorId).toBe(doctor.id);
  });
});
