// Check if Prisma client is available
let prisma: any;
let UserRole: any, Gender: any, AppointmentStatus: any, TreatmentStatus: any, PaymentMethod: any, PaymentStatus: any, RecordType: any;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  
  // Try to import enums (will work after prisma generate)
  try {
    const enums = require('@prisma/client');
    UserRole = enums.UserRole;
    Gender = enums.Gender;
    AppointmentStatus = enums.AppointmentStatus;
    TreatmentStatus = enums.TreatmentStatus;
    PaymentMethod = enums.PaymentMethod;
    PaymentStatus = enums.PaymentStatus;
    RecordType = enums.RecordType;
  } catch (enumError) {
    // Fallback to string literals if enums not available
    UserRole = {
      ADMIN: 'ADMIN',
      DOCTOR: 'DOCTOR',
      NURSE: 'NURSE',
      RECEPTIONIST: 'RECEPTIONIST',
      PATIENT: 'PATIENT'
    };
    Gender = {
      MALE: 'MALE',
      FEMALE: 'FEMALE',
      OTHER: 'OTHER',
      PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY'
    };
    AppointmentStatus = {
      SCHEDULED: 'SCHEDULED',
      CONFIRMED: 'CONFIRMED',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
      NO_SHOW: 'NO_SHOW'
    };
    TreatmentStatus = {
      PLANNED: 'PLANNED',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED'
    };
    PaymentMethod = {
      CASH: 'CASH',
      CREDIT_CARD: 'CREDIT_CARD',
      DEBIT_CARD: 'DEBIT_CARD',
      INSURANCE: 'INSURANCE',
      CHECK: 'CHECK',
      BANK_TRANSFER: 'BANK_TRANSFER'
    };
    PaymentStatus = {
      PENDING: 'PENDING',
      PAID: 'PAID',
      FAILED: 'FAILED',
      REFUNDED: 'REFUNDED',
      PARTIAL: 'PARTIAL'
    };
    RecordType = {
      XRAY: 'XRAY',
      PHOTO: 'PHOTO',
      REPORT: 'REPORT',
      PRESCRIPTION: 'PRESCRIPTION',
      NOTE: 'NOTE',
      OTHER: 'OTHER'
    };
  }
} catch (error) {
  console.log('❌ Prisma client not available. Please run "npx prisma generate" first.');
  console.log('   Your app is currently running with mock data.');
  process.exit(0);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create system settings
  console.log('📋 Creating system settings...');
  await prisma.systemSetting.createMany({
    data: [
      {
        key: 'clinic_name',
        value: 'DentalCare Pro',
        type: 'STRING',
        category: 'general'
      },
      {
        key: 'clinic_address',
        value: '123 Healthcare Ave, Medical City, MC 12345',
        type: 'STRING',
        category: 'general'
      },
      {
        key: 'clinic_phone',
        value: '(555) 123-4567',
        type: 'STRING',
        category: 'general'
      },
      {
        key: 'clinic_email',
        value: 'info@dentalcarepro.com',
        type: 'STRING',
        category: 'general'
      },
      {
        key: 'appointment_duration_default',
        value: '60',
        type: 'NUMBER',
        category: 'appointments'
      },
      {
        key: 'business_hours',
        value: '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "15:00"}, "sunday": {"closed": true}}',
        type: 'JSON',
        category: 'general'
      }
    ]
  });

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dentalcarepro.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '(555) 123-4567',
      address: '123 Healthcare Ave',
      city: 'Medical City',
      state: 'MC',
      zipCode: '12345',
      dateOfBirth: new Date('1980-01-01'),
      gender: Gender.PREFER_NOT_TO_SAY,
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '(555) 987-6543',
      insuranceProvider: 'Admin Insurance',
      insuranceNumber: 'ADMIN123456',
    }
  });

  // Create doctors
  console.log('👨‍⚕️ Creating doctors...');
  const doctors = [
    {
      email: 'dr.smith@dentalcarepro.com',
      firstName: 'Sarah',
      lastName: 'Smith',
      phone: '(555) 111-1111',
      licenseNumber: 'DENT123456',
      specialties: ['General Dentistry', 'Preventive Care'],
      experience: 15,
      education: ['DDS - Harvard School of Dental Medicine', 'MS - Oral Biology'],
      certifications: ['Board Certified General Dentist', 'ADA Member'],
      bio: 'Dr. Sarah Smith has been practicing dentistry for over 15 years with a focus on preventive care and patient education.',
      rating: 4.9
    },
    {
      email: 'dr.johnson@dentalcarepro.com',
      firstName: 'Michael',
      lastName: 'Johnson',
      phone: '(555) 222-2222',
      licenseNumber: 'DENT789012',
      specialties: ['Orthodontics', 'Cosmetic Dentistry'],
      experience: 12,
      education: ['DDS - University of California', 'MS - Orthodontics'],
      certifications: ['Board Certified Orthodontist', 'Invisalign Provider'],
      bio: 'Dr. Michael Johnson specializes in orthodontics and cosmetic dentistry, helping patients achieve beautiful, healthy smiles.',
      rating: 4.8
    },
    {
      email: 'dr.davis@dentalcarepro.com',
      firstName: 'Emily',
      lastName: 'Davis',
      phone: '(555) 333-3333',
      licenseNumber: 'DENT345678',
      specialties: ['Oral Surgery', 'Implant Dentistry'],
      experience: 10,
      education: ['DDS - Columbia University', 'MS - Oral and Maxillofacial Surgery'],
      certifications: ['Board Certified Oral Surgeon', 'Implant Specialist'],
      bio: 'Dr. Emily Davis is a skilled oral surgeon specializing in complex extractions, implants, and oral pathology.',
      rating: 4.7
    }
  ];

  const createdDoctors = [];
  for (const doctorData of doctors) {
    const user = await prisma.user.create({
      data: {
        email: doctorData.email,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        role: UserRole.DOCTOR,
        phone: doctorData.phone,
        address: '123 Healthcare Ave',
        city: 'Medical City',
        state: 'MC',
        zipCode: '12345',
        dateOfBirth: new Date('1975-01-01'),
        gender: Gender.FEMALE,
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '(555) 987-6543',
      }
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        licenseNumber: doctorData.licenseNumber,
        specialties: doctorData.specialties,
        experience: doctorData.experience,
        education: doctorData.education,
        certifications: doctorData.certifications,
        bio: doctorData.bio,
        rating: doctorData.rating,
      }
    });

    createdDoctors.push({ user, doctor });
  }

  // Create doctor schedules
  console.log('📅 Creating doctor schedules...');
  for (const { doctor } of createdDoctors) {
    await prisma.doctorSchedule.createMany({
      data: [
        // Monday to Friday
        { doctorId: doctor.id, dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
        { doctorId: doctor.id, dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
        { doctorId: doctor.id, dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
        { doctorId: doctor.id, dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
        { doctorId: doctor.id, dayOfWeek: 5, startTime: '08:00', endTime: '17:00' },
        // Saturday
        { doctorId: doctor.id, dayOfWeek: 6, startTime: '09:00', endTime: '15:00' },
      ]
    });
  }

  // Create services
  console.log('🦷 Creating services...');
  const services = [
    {
      name: 'General Checkup',
      description: 'Comprehensive dental examination and cleaning',
      category: 'Preventive',
      duration: 60,
      price: 150.00
    },
    {
      name: 'Teeth Cleaning',
      description: 'Professional dental cleaning and polishing',
      category: 'Preventive',
      duration: 45,
      price: 120.00
    },
    {
      name: 'Dental Filling',
      description: 'Composite or amalgam filling for cavities',
      category: 'Restorative',
      duration: 60,
      price: 200.00
    },
    {
      name: 'Root Canal',
      description: 'Endodontic treatment for infected teeth',
      category: 'Endodontics',
      duration: 120,
      price: 800.00
    },
    {
      name: 'Tooth Extraction',
      description: 'Simple or surgical tooth removal',
      category: 'Oral Surgery',
      duration: 45,
      price: 250.00
    },
    {
      name: 'Dental Implant',
      description: 'Titanium implant placement',
      category: 'Oral Surgery',
      duration: 90,
      price: 2000.00
    },
    {
      name: 'Braces Consultation',
      description: 'Orthodontic evaluation and treatment planning',
      category: 'Orthodontics',
      duration: 60,
      price: 200.00
    },
    {
      name: 'Teeth Whitening',
      description: 'Professional teeth whitening treatment',
      category: 'Cosmetic',
      duration: 90,
      price: 400.00
    }
  ];

  const createdServices = [];
  for (const serviceData of services) {
    const service = await prisma.service.create({
      data: serviceData
    });
    createdServices.push(service);
  }

  // Create sample patients
  console.log('👥 Creating sample patients...');
  const patients = [
    {
      email: 'john.doe@email.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '(555) 444-4444',
      dateOfBirth: new Date('1985-03-15'),
      gender: Gender.MALE,
      insuranceProvider: 'Blue Cross Blue Shield',
      insuranceNumber: 'BCBS123456789',
    },
    {
      email: 'jane.smith@email.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '(555) 555-5555',
      dateOfBirth: new Date('1990-07-22'),
      gender: Gender.FEMALE,
      insuranceProvider: 'Aetna',
      insuranceNumber: 'AETNA987654321',
    },
    {
      email: 'bob.johnson@email.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '(555) 666-6666',
      dateOfBirth: new Date('1978-11-08'),
      gender: Gender.MALE,
      insuranceProvider: 'Cigna',
      insuranceNumber: 'CIGNA456789123',
    },
    {
      email: 'alice.brown@email.com',
      firstName: 'Alice',
      lastName: 'Brown',
      phone: '(555) 777-7777',
      dateOfBirth: new Date('1992-05-12'),
      gender: Gender.FEMALE,
      insuranceProvider: 'United Healthcare',
      insuranceNumber: 'UHC789123456',
    },
    {
      email: 'charlie.wilson@email.com',
      firstName: 'Charlie',
      lastName: 'Wilson',
      phone: '(555) 888-8888',
      dateOfBirth: new Date('1988-09-30'),
      gender: Gender.MALE,
      insuranceProvider: 'Humana',
      insuranceNumber: 'HUMANA123789456',
    }
  ];

  const createdPatients = [];
  for (const patientData of patients) {
    const patient = await prisma.user.create({
      data: {
        ...patientData,
        role: UserRole.PATIENT,
        address: '123 Patient St',
        city: 'Patient City',
        state: 'PC',
        zipCode: '54321',
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '(555) 999-9999',
      }
    });
    createdPatients.push(patient);
  }

  // Create sample appointments
  console.log('📅 Creating sample appointments...');
  const today = new Date();
  const appointments = [
    {
      patientId: createdPatients[0].id,
      doctorId: createdDoctors[0].doctor.id,
      serviceId: createdServices[0].id,
      date: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9 AM
      endTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 AM
      status: AppointmentStatus.SCHEDULED,
      notes: 'Regular checkup appointment',
      reason: 'Annual dental examination'
    },
    {
      patientId: createdPatients[1].id,
      doctorId: createdDoctors[1].doctor.id,
      serviceId: createdServices[1].id,
      date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      startTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 2 PM
      endTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 3 PM
      status: AppointmentStatus.SCHEDULED,
      notes: 'Teeth cleaning appointment',
      reason: 'Regular cleaning and maintenance'
    },
    {
      patientId: createdPatients[2].id,
      doctorId: createdDoctors[2].doctor.id,
      serviceId: createdServices[2].id,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      startTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 AM
      endTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11 AM
      status: AppointmentStatus.SCHEDULED,
      notes: 'Filling appointment',
      reason: 'Cavity treatment'
    }
  ];

  const createdAppointments = [];
  for (const appointmentData of appointments) {
    const appointment = await prisma.appointment.create({
      data: appointmentData
    });
    createdAppointments.push(appointment);
  }

  // Create sample treatments
  console.log('🩺 Creating sample treatments...');
  for (let i = 0; i < createdAppointments.length; i++) {
    const appointment = createdAppointments[i];
    const patient = createdPatients[i];
    const doctor = createdDoctors[i % createdDoctors.length].doctor;
    const service = createdServices[i % createdServices.length];

    await prisma.treatment.create({
      data: {
        appointmentId: appointment.id,
        patientId: patient.id,
        doctorId: doctor.id,
        serviceId: service.id,
        diagnosis: i === 0 ? 'Healthy teeth, minor plaque buildup' : i === 1 ? 'Good oral health' : 'Small cavity detected',
        treatmentPlan: i === 0 ? 'Regular cleaning and preventive care' : i === 1 ? 'Continue current oral hygiene routine' : 'Composite filling required',
        notes: i === 0 ? 'Patient maintains good oral hygiene' : i === 1 ? 'No issues found' : 'Cavity in molar tooth',
        status: i === 0 ? TreatmentStatus.COMPLETED : i === 1 ? TreatmentStatus.COMPLETED : TreatmentStatus.PLANNED,
      }
    });
  }

  // Create sample payments
  console.log('💳 Creating sample payments...');
  for (let i = 0; i < createdAppointments.length; i++) {
    const appointment = createdAppointments[i];
    const patient = createdPatients[i];
    const service = createdServices[i % createdServices.length];

    await prisma.payment.create({
      data: {
        patientId: patient.id,
        appointmentId: appointment.id,
        amount: service.price,
        method: i === 0 ? PaymentMethod.INSURANCE : i === 1 ? PaymentMethod.CREDIT_CARD : PaymentMethod.CASH,
        status: i === 0 ? PaymentStatus.PAID : i === 1 ? PaymentStatus.PENDING : PaymentStatus.PENDING,
        notes: i === 0 ? 'Insurance covered' : i === 1 ? 'Pending payment' : 'Cash payment due',
        paidAt: i === 0 ? new Date() : null,
      }
    });
  }

  // Create sample medical records
  console.log('📋 Creating sample medical records...');
  for (let i = 0; i < createdPatients.length; i++) {
    const patient = createdPatients[i];
    
    await prisma.medicalRecord.createMany({
      data: [
        {
          patientId: patient.id,
          type: RecordType.REPORT,
          title: 'Initial Examination Report',
          description: 'Comprehensive dental examination findings',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
        {
          patientId: patient.id,
          type: RecordType.XRAY,
          title: 'Dental X-Ray',
          description: 'Full mouth X-ray series',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        }
      ]
    });
  }

  // Create sample doctor reviews
  console.log('⭐ Creating sample doctor reviews...');
  const reviewData = [
    { doctorIndex: 0, patientIndex: 0, rating: 5, comment: 'Excellent service and very professional!' },
    { doctorIndex: 1, patientIndex: 1, rating: 4, comment: 'Great experience, would recommend.' },
    { doctorIndex: 2, patientIndex: 2, rating: 5, comment: 'Dr. Davis is amazing at what she does.' },
  ];

  for (const review of reviewData) {
    await prisma.doctorReview.create({
      data: {
        doctorId: createdDoctors[review.doctorIndex].doctor.id,
        patientId: createdPatients[review.patientIndex].id,
        rating: review.rating,
        comment: review.comment,
      }
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${createdPatients.length} patients`);
  console.log(`   - ${createdDoctors.length} doctors`);
  console.log(`   - ${createdServices.length} services`);
  console.log(`   - ${createdAppointments.length} appointments`);
  console.log(`   - 1 admin user`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
