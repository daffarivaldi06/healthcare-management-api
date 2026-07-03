import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare Management API',
      version: '1.0.0',
      description: 'REST API for managing patients, appointments, documents, users, and audit logs.'
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          example: { email: 'admin@healthcare.local', password: 'Password123!' }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          example: {
            name: 'Clinic Staff',
            email: 'staff3@healthcare.local',
            password: 'Password123!',
            role: 'STAFF'
          }
        },
        PatientRequest: {
          type: 'object',
          required: [
            'fullName',
            'dateOfBirth',
            'gender',
            'phone',
            'address',
            'emergencyContactName',
            'emergencyContactPhone',
            'medicalRecordNumber'
          ],
          example: {
            fullName: 'Alya Putri',
            dateOfBirth: '1992-04-15',
            gender: 'FEMALE',
            phone: '+628123456789',
            address: 'Jakarta, Indonesia',
            emergencyContactName: 'Budi Putra',
            emergencyContactPhone: '+628987654321',
            medicalRecordNumber: 'MRN-1001'
          }
        },
        AppointmentRequest: {
          type: 'object',
          required: ['patientId', 'doctorId', 'scheduledAt'],
          example: {
            patientId: 'patient-id',
            doctorId: 'doctor-user-id',
            scheduledAt: '2026-06-10T09:00:00.000Z',
            reason: 'General consultation'
          }
        },
        DocumentRequest: {
          type: 'object',
          required: ['patientId', 'title', 'content', 'type'],
          example: {
            patientId: 'patient-id',
            title: 'Medical Certificate',
            content: 'Patient requires three days of rest.',
            type: 'MEDICAL_CERTIFICATE'
          }
        }
      }
    }
  },
  apis: ['src/modules/**/*.ts', 'src/docs/*.ts']
});
