// Mock API implementation that works without database connection
// This will be replaced by the real API once database is connected

import { format } from 'date-fns';

// Type definitions
export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type TreatmentStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'INSURANCE' | 'CHECK' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL';
export type RecordType = 'XRAY' | 'PHOTO' | 'REPORT' | 'PRESCRIPTION' | 'NOTE' | 'OTHER';

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
    patient: { firstName: 'John', lastName: 'Doe' },
    doctor: { user: { firstName: 'Sarah', lastName: 'Smith' } },
    service: { name: 'General Checkup' }
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
    patient: { firstName: 'Jane', lastName: 'Smith' },
    doctor: { user: { firstName: 'Michael', lastName: 'Johnson' } },
    service: { name: 'Teeth Cleaning' }
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
    patient: { firstName: 'Bob', lastName: 'Johnson' },
    doctor: { user: { firstName: 'Emily', lastName: 'Davis' } },
    service: { name: 'Dental Filling' }
  }
];

const mockDoctors = [
  {
    id: '1',
    user: { firstName: 'Sarah', lastName: 'Smith' },
    specialties: ['General Dentistry', 'Preventive Care'],
    rating: 4.9,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 150, reviews: 25 }
  },
  {
    id: '2',
    user: { firstName: 'Michael', lastName: 'Johnson' },
    specialties: ['Orthodontics', 'Cosmetic Dentistry'],
    rating: 4.8,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 120, reviews: 20 }
  },
  {
    id: '3',
    user: { firstName: 'Emily', lastName: 'Davis' },
    specialties: ['Oral Surgery', 'Implant Dentistry'],
    rating: 4.7,
    appointments: [],
    reviews: [{ rating: 5 }, { rating: 4 }],
    _count: { appointments: 90, reviews: 15 }
  }
];

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

// API Classes
export class DashboardAPI {
  static async getStats() {
    return {
      totalPatients: mockPatients.length,
      newPatientsThisMonth: 23,
      todayAppointments: 8,
      upcomingAppointments: mockAppointments.length,
      monthlyRevenue: 45000,
      pendingPayments: 5000,
      totalDoctors: mockDoctors.length,
      activeDoctors: mockDoctors.length,
      totalServices: 8,
      satisfactionScore: 92,
      systemHealth: 'excellent' as const
    };
  }

  static async getRecentPatients(limit: number = 5) {
    return mockPatients.slice(0, limit);
  }

  static async getUpcomingAppointments(limit: number = 5) {
    return mockAppointments.slice(0, limit);
  }

  static async getTopDoctors(limit: number = 5) {
    return mockDoctors.slice(0, limit);
  }
}

export class PatientsAPI {
  static async getAll(search?: string, page: number = 1, limit: number = 10) {
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
    return mockPatients.find(patient => patient.id === id) || null;
  }

  static async create(data: any) {
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
    const index = mockPatients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      mockPatients[index] = { ...mockPatients[index], ...data, updatedAt: new Date() };
      return mockPatients[index];
    }
    return null;
  }

  static async delete(id: string) {
    const index = mockPatients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      return mockPatients.splice(index, 1)[0];
    }
    return null;
  }
}

export class AppointmentsAPI {
  static async getAll(filters?: any, page: number = 1, limit: number = 10) {
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
    return mockAppointments.find(appointment => appointment.id === id) || null;
  }

  static async create(data: any) {
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
    const index = mockAppointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...data, updatedAt: new Date() };
      return mockAppointments[index];
    }
    return null;
  }

  static async delete(id: string) {
    const index = mockAppointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      return mockAppointments.splice(index, 1)[0];
    }
    return null;
  }
}

export class DoctorsAPI {
  static async getAll(search?: string, page: number = 1, limit: number = 10) {
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
    return mockDoctors.find(doctor => doctor.id === id) || null;
  }
}

export class ServicesAPI {
  static async getAll(search?: string, category?: string) {
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
    const mockServices = await this.getAll();
    return mockServices.find(service => service.id === id) || null;
  }

  static async create(data: any) {
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
    // Mock implementation
    return { id, ...data, updatedAt: new Date() };
  }

  static async delete(id: string) {
    // Mock implementation
    return { id, isActive: false };
  }
}

export class MedicalRecordsAPI {
  static async getByPatient(patientId: string, type?: RecordType) {
    // Mock implementation
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
    return {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async update(id: string, data: any) {
    return { id, ...data, updatedAt: new Date() };
  }

  static async delete(id: string) {
    return { id, deleted: true };
  }
}
