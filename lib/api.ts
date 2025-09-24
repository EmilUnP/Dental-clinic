// For frontend use, we'll use mock data
// In a real application, this would make API calls to a backend server

// Type definitions
export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type TreatmentStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'INSURANCE' | 'CHECK' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL';
export type RecordType = 'XRAY' | 'PHOTO' | 'REPORT' | 'PRESCRIPTION' | 'NOTE' | 'OTHER';

// Base types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  insuranceProvider?: string | null;
  insuranceNumber?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  userId: string;
  licenseNumber: string;
  specialties: string[];
  experience: number;
  education: string[];
  certifications: string[];
  bio?: string | null;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  duration: number;
  price: any; // Prisma Decimal type
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string | null;
  reason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Treatment {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  diagnosis?: string | null;
  treatmentPlan?: string | null;
  notes?: string | null;
  followUpDate?: Date | null;
  status: TreatmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId?: string | null;
  amount: any; // Prisma Decimal type
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  notes?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  treatmentId?: string | null;
  type: RecordType;
  title: string;
  description?: string | null;
  filePath?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Types for API responses
export interface DashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  todayAppointments: number;
  upcomingAppointments: number;
  monthlyRevenue: number;
  pendingPayments: number;
  totalDoctors: number;
  activeDoctors: number;
  totalServices: number;
  satisfactionScore: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface PatientWithAppointments extends User {
  appointmentsAsPatient: (Appointment & {
    doctor: Doctor & { user: User };
    service: Service;
  })[];
}

export interface DoctorWithStats extends Doctor {
  user: User;
  appointments: Appointment[];
  reviews: { rating: number }[];
  _count: {
    appointments: number;
    reviews: number;
  };
}

export interface AppointmentWithDetails extends Appointment {
  patient: User;
  doctor: Doctor & { user: User };
  service: Service;
  treatment?: Treatment | null;
  payment?: Payment | null;
}

// Mock data
const mockPatients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 444-4444',
    role: 'PATIENT' as UserRole,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    appointmentsAsPatient: [
      {
        id: '1',
        date: new Date('2024-01-20'),
        doctor: {
          id: '1',
          user: { firstName: 'Sarah', lastName: 'Smith' },
          specialties: ['General Dentistry']
        },
        service: { name: 'General Checkup' }
      }
    ]
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 555-5555',
    role: 'PATIENT' as UserRole,
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    appointmentsAsPatient: [
      {
        id: '2',
        date: new Date('2024-01-21'),
        doctor: {
          id: '2',
          user: { firstName: 'Michael', lastName: 'Johnson' },
          specialties: ['Orthodontics']
        },
        service: { name: 'Teeth Cleaning' }
      }
    ]
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@email.com',
    phone: '(555) 666-6666',
    role: 'PATIENT' as UserRole,
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    appointmentsAsPatient: [
      {
        id: '3',
        date: new Date('2024-01-22'),
        doctor: {
          id: '3',
          user: { firstName: 'Emily', lastName: 'Davis' },
          specialties: ['Oral Surgery']
        },
        service: { name: 'Dental Filling' }
      }
    ]
  }
];

const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    serviceId: '1',
    date: new Date('2024-01-20'),
    startTime: new Date('2024-01-20T10:00:00'),
    endTime: new Date('2024-01-20T11:00:00'),
    status: 'SCHEDULED' as AppointmentStatus,
    patient: { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com' },
    doctor: { user: { firstName: 'Sarah', lastName: 'Smith' } },
    service: { name: 'General Checkup', duration: 60 }
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    serviceId: '2',
    date: new Date('2024-01-20'),
    startTime: new Date('2024-01-20T14:00:00'),
    endTime: new Date('2024-01-20T15:00:00'),
    status: 'SCHEDULED' as AppointmentStatus,
    patient: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com' },
    doctor: { user: { firstName: 'Michael', lastName: 'Johnson' } },
    service: { name: 'Teeth Cleaning', duration: 45 }
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '3',
    serviceId: '3',
    date: new Date('2024-01-21'),
    startTime: new Date('2024-01-21T09:00:00'),
    endTime: new Date('2024-01-21T10:00:00'),
    status: 'SCHEDULED' as AppointmentStatus,
    patient: { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@email.com' },
    doctor: { user: { firstName: 'Emily', lastName: 'Davis' } },
    service: { name: 'Dental Filling', duration: 60 }
  }
];

const mockDoctors = [
  {
    id: '1',
    user: { firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@clinic.com' },
    specialties: ['General Dentistry', 'Preventive Care'],
    rating: 4.9,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 150, reviews: 25 }
  },
  {
    id: '2',
    user: { firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@clinic.com' },
    specialties: ['Orthodontics', 'Cosmetic Dentistry'],
    rating: 4.8,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 120, reviews: 20 }
  },
  {
    id: '3',
    user: { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@clinic.com' },
    specialties: ['Oral Surgery', 'Implant Dentistry'],
    rating: 4.7,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 90, reviews: 15 }
  }
];

const mockServices = [
  {
    id: '1',
    name: 'General Checkup',
    description: 'Comprehensive dental examination and cleaning',
    category: 'Preventive',
    duration: 60,
    price: 150.00,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Teeth Cleaning',
    description: 'Professional dental cleaning and polishing',
    category: 'Preventive',
    duration: 45,
    price: 120.00,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Dental Filling',
    description: 'Composite or amalgam filling for cavities',
    category: 'Restorative',
    duration: 60,
    price: 200.00,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Dashboard API
export class DashboardAPI {
  static async getStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      totalPatients: 150,
      newPatientsThisMonth: 23,
      todayAppointments: 8,
      upcomingAppointments: 12,
      monthlyRevenue: 45000,
      pendingPayments: 5000,
      totalDoctors: 3,
      activeDoctors: 3,
      totalServices: 25,
      satisfactionScore: 92,
      systemHealth: 'excellent' as const
    };
  }

  static async getRecentPatients(limit: number = 5): Promise<PatientWithAppointments[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPatients.slice(0, limit) as any;
  }

  static async getUpcomingAppointments(limit: number = 5): Promise<AppointmentWithDetails[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockAppointments.slice(0, limit) as any;
  }

  static async getTopDoctors(limit: number = 5): Promise<DoctorWithStats[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDoctors.slice(0, limit) as any;
  }
}

// Patients API
export class PatientsAPI {
  static async getAll(search?: string, page: number = 1, limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredPatients = mockPatients;
    
    if (search) {
      filteredPatients = mockPatients.filter(patient => 
        patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const patients = filteredPatients.slice(startIndex, endIndex);

    return {
      patients,
      total: filteredPatients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPatients.length / limit)
    };
  }

  static async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPatients.find(patient => patient.id === id) || null;
  }

  static async create(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newPatient = {
      id: (mockPatients.length + 1).toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      appointmentsAsPatient: []
    };
    mockPatients.push(newPatient);
    return newPatient;
  }

  static async update(id: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockPatients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      mockPatients[index] = { ...mockPatients[index], ...data, updatedAt: new Date() };
      return mockPatients[index];
    }
    return null;
  }

  static async delete(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockPatients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      return mockPatients.splice(index, 1)[0];
    }
    return null;
  }
}

// Appointments API
export class AppointmentsAPI {
  static async getAll(filters?: any, page: number = 1, limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredAppointments = mockAppointments;
    
    if (filters?.status) {
      filteredAppointments = mockAppointments.filter(app => app.status === filters.status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const appointments = filteredAppointments.slice(startIndex, endIndex);

    return {
      appointments,
      total: filteredAppointments.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAppointments.length / limit)
    };
  }

  static async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockAppointments.find(appointment => appointment.id === id) || null;
  }

  static async create(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newAppointment = {
      id: (mockAppointments.length + 1).toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  }

  static async update(id: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockAppointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...data, updatedAt: new Date() };
      return mockAppointments[index];
    }
    return null;
  }

  static async delete(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockAppointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      return mockAppointments.splice(index, 1)[0];
    }
    return null;
  }
}

// Doctors API
export class DoctorsAPI {
  static async getAll(search?: string, page: number = 1, limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredDoctors = mockDoctors;
    
    if (search) {
      filteredDoctors = mockDoctors.filter(doctor => 
        doctor.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        doctor.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialties.some(specialty => specialty.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const doctors = filteredDoctors.slice(startIndex, endIndex);

    return {
      doctors,
      total: filteredDoctors.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDoctors.length / limit)
    };
  }

  static async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDoctors.find(doctor => doctor.id === id) || null;
  }
}

// Services API
export class ServicesAPI {
  static async getAll(search?: string, category?: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredServices = mockServices;
    
    if (search) {
      filteredServices = mockServices.filter(service => 
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredServices = filteredServices.filter(service => service.category === category);
    }

    return filteredServices;
  }

  static async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockServices.find(service => service.id === id) || null;
  }

  static async create(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newService = {
      id: Date.now().toString(),
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newService;
  }

  static async update(id: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, ...data, updatedAt: new Date() };
  }

  static async delete(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, isActive: false };
  }
}

// Medical Records API
export class MedicalRecordsAPI {
  static async getByPatient(patientId: string, type?: RecordType) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: '1',
      patientId,
        type: 'REPORT' as RecordType,
        title: 'Initial Examination Report',
        description: 'Comprehensive dental examination findings',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  static async create(data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async update(id: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, ...data, updatedAt: new Date() };
  }

  static async delete(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, deleted: true };
  }
}