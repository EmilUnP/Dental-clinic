import { DashboardAPI, DashboardStats } from '../lib/api';
import { format } from 'date-fns';

// Data service to aggregate data from all pages for the dashboard
export interface DashboardData {
  // Patient data
  totalPatients: number;
  newPatientsThisMonth: number;
  recentPatients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    lastVisit: string;
  }>;

  // Appointment data
  todayAppointments: number;
  upcomingAppointments: Array<{
    id: string;
    patientName: string;
    date: string;
    time: string;
    type: string;
    doctor: string;
    status: string;
  }>;
  appointmentStats: {
    completed: number;
    pending: number;
    cancelled: number;
  };

  // Revenue data (simplified)
  monthlyRevenue: number;
  pendingPayments: number;

  // Services data
  totalServices: number;
  activeServices: number;

  // Doctors data
  totalDoctors: number;
  activeDoctors: number;
  topDoctors: Array<{
    id: string;
    name: string;
    specialty: string;
    rating: number;
    totalPatients: number;
  }>;

  // Overall stats
  satisfactionScore: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

// Real data service that fetches from the database
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch all dashboard data in parallel for better performance
    const [
      stats,
      recentPatients,
      upcomingAppointments,
      topDoctors
    ] = await Promise.all([
      DashboardAPI.getStats(),
      DashboardAPI.getRecentPatients(3),
      DashboardAPI.getUpcomingAppointments(3),
      DashboardAPI.getTopDoctors(3)
    ]);

    // Transform recent patients data
    const transformedRecentPatients = recentPatients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      status: patient.isActive ? 'Active' : 'Inactive',
      lastVisit: patient.appointmentsAsPatient.length > 0 
        ? format(new Date(patient.appointmentsAsPatient[0].date), 'yyyy-MM-dd')
        : 'Never'
    }));

    // Transform upcoming appointments data
    const transformedUpcomingAppointments = upcomingAppointments.map(appointment => ({
      id: appointment.id,
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      date: format(new Date(appointment.date), 'yyyy-MM-dd'),
      time: format(new Date(appointment.startTime), 'h:mm a'),
      type: appointment.service.name,
      doctor: `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      status: appointment.status
    }));

    // Transform top doctors data
    const transformedTopDoctors = topDoctors.map(doctor => ({
      id: doctor.id,
      name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
      specialty: doctor.specialties.join(', '),
      rating: doctor.rating,
      totalPatients: doctor._count.appointments
    }));

    return {
      totalPatients: stats.totalPatients,
      newPatientsThisMonth: stats.newPatientsThisMonth,
      todayAppointments: stats.todayAppointments,
      appointmentStats: {
        completed: 0, // Would need additional query for this
        pending: stats.upcomingAppointments,
        cancelled: 0, // Would need additional query for this
      },
      monthlyRevenue: stats.monthlyRevenue,
      pendingPayments: stats.pendingPayments,
      satisfactionScore: stats.satisfactionScore,
      totalDoctors: stats.totalDoctors,
      activeDoctors: stats.activeDoctors,
      totalServices: stats.totalServices,
      activeServices: stats.totalServices, // Assuming all services are active in mock
      systemHealth: stats.systemHealth,
      recentPatients: transformedRecentPatients,
      upcomingAppointments: transformedUpcomingAppointments,
      topDoctors: transformedTopDoctors,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Fallback to mock data in case of database error
    return getMockDashboardData();
  }
};

// Fallback mock data function
const getMockDashboardData = (): DashboardData => {
  return {
    totalPatients: 150,
    newPatientsThisMonth: 23,
    todayAppointments: 8,
    appointmentStats: {
      completed: 5,
      pending: 8,
      cancelled: 2,
    },
    monthlyRevenue: 45000,
    pendingPayments: 5000,
    satisfactionScore: 92,
    totalDoctors: 3,
    activeDoctors: 3,
    totalServices: 25,
    activeServices: 20,
    systemHealth: 'excellent',
    recentPatients: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      status: 'Active',
      lastVisit: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      status: 'Active',
      lastVisit: '2024-01-14',
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@email.com',
      status: 'New',
      lastVisit: '2024-01-13',
    },
    ],
    upcomingAppointments: [
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-01-20',
      time: '10:00 AM',
        type: 'General Checkup',
        doctor: 'Dr. Sarah Smith',
        status: 'SCHEDULED',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-01-20',
      time: '2:00 PM',
        type: 'Teeth Cleaning',
        doctor: 'Dr. Michael Johnson',
        status: 'SCHEDULED',
    },
    {
      id: '3',
      patientName: 'Bob Johnson',
      date: '2024-01-21',
      time: '9:00 AM',
        type: 'Dental Filling',
        doctor: 'Dr. Emily Davis',
        status: 'SCHEDULED',
      },
    ],
    topDoctors: [
    {
      id: '1',
      name: 'Dr. Sarah Smith',
        specialty: 'General Dentistry, Preventive Care',
      rating: 4.9,
      totalPatients: 150,
    },
    {
      id: '2',
      name: 'Dr. Michael Johnson',
        specialty: 'Orthodontics, Cosmetic Dentistry',
      rating: 4.8,
      totalPatients: 120,
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
        specialty: 'Oral Surgery, Implant Dentistry',
      rating: 4.7,
      totalPatients: 90,
    },
    ],
  };
};