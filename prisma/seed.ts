import { AppointmentStatus, DocumentType, Gender, PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const password = 'Password123!';

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthcare.local' },
    update: {},
    create: {
      name: 'Daffa Admin',
      email: 'admin@healthcare.local',
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const doctorOne = await prisma.user.upsert({
    where: { email: 'doctor.one@healthcare.local' },
    update: {},
    create: {
      name: 'Dr. Maya Santoso',
      email: 'doctor.one@healthcare.local',
      passwordHash,
      role: UserRole.DOCTOR
    }
  });

  const doctorTwo = await prisma.user.upsert({
    where: { email: 'doctor.two@healthcare.local' },
    update: {},
    create: {
      name: 'Dr. Arif Pratama',
      email: 'doctor.two@healthcare.local',
      passwordHash,
      role: UserRole.DOCTOR
    }
  });

  await prisma.user.upsert({
    where: { email: 'staff.one@healthcare.local' },
    update: {},
    create: {
      name: 'Nadia Staff',
      email: 'staff.one@healthcare.local',
      passwordHash,
      role: UserRole.STAFF
    }
  });

  await prisma.user.upsert({
    where: { email: 'staff.two@healthcare.local' },
    update: {},
    create: {
      name: 'Rizky Staff',
      email: 'staff.two@healthcare.local',
      passwordHash,
      role: UserRole.STAFF
    }
  });

  const patientOne = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN-1001' },
    update: {},
    create: {
      fullName: 'Alya Putri',
      dateOfBirth: new Date('1992-04-15'),
      gender: Gender.FEMALE,
      phone: '+628123456789',
      address: 'Jakarta, Indonesia',
      emergencyContactName: 'Budi Putra',
      emergencyContactPhone: '+628987654321',
      medicalRecordNumber: 'MRN-1001'
    }
  });

  const patientTwo = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN-1002' },
    update: {},
    create: {
      fullName: 'Rama Wijaya',
      dateOfBirth: new Date('1985-09-02'),
      gender: Gender.MALE,
      phone: '+628111222333',
      address: 'Bandung, Indonesia',
      emergencyContactName: 'Sinta Wijaya',
      emergencyContactPhone: '+628444555666',
      medicalRecordNumber: 'MRN-1002'
    }
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patientOne.id,
        doctorId: doctorOne.id,
        scheduledAt: new Date('2026-06-10T09:00:00.000Z'),
        reason: 'General consultation',
        status: AppointmentStatus.SCHEDULED
      },
      {
        patientId: patientTwo.id,
        doctorId: doctorTwo.id,
        scheduledAt: new Date('2026-06-11T13:00:00.000Z'),
        reason: 'Follow-up visit',
        status: AppointmentStatus.COMPLETED
      }
    ],
    skipDuplicates: true
  });

  await prisma.hospitalDocument.createMany({
    data: [
      {
        patientId: patientOne.id,
        createdBy: admin.id,
        title: 'Medical Certificate',
        content: 'Patient requires three days of rest.',
        type: DocumentType.MEDICAL_CERTIFICATE
      },
      {
        patientId: patientTwo.id,
        createdBy: doctorTwo.id,
        title: 'Referral Letter',
        content: 'Referral for specialist review.',
        type: DocumentType.REFERRAL_LETTER
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed completed. Demo password:', password);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
