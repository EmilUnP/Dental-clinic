import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Skeleton from '../components/ui/skeleton';
import Badge from '../components/ui/badge';
import Button from '../components/ui/button';
import Tooltip from '../components/ui/Tooltip';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  UserCheck, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Star,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { getDashboardData, DashboardData } from '../services/dataService';
import { useDataFetch } from '../hooks/useDataFetch';
import { formatCurrency, formatDate } from '../utils/formatters';
import { STATUS_TYPES, SYSTEM_HEALTH } from '../constants';

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDataFetch(getDashboardData);
  const { toasts, removeToast, success, error: showError } = useToast();

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      [STATUS_TYPES.PATIENT.ACTIVE.toLowerCase()]: 'bg-green-100 text-green-800',
      [STATUS_TYPES.APPOINTMENT.SCHEDULED.toLowerCase()]: 'bg-green-100 text-green-800',
      [STATUS_TYPES.INVOICE.PAID.toLowerCase()]: 'bg-green-100 text-green-800',
      [STATUS_TYPES.APPOINTMENT.COMPLETED.toLowerCase()]: 'bg-green-100 text-green-800',
      [STATUS_TYPES.INVOICE.SENT.toLowerCase()]: 'bg-yellow-100 text-yellow-800',
      [STATUS_TYPES.MESSAGE.DRAFT.toLowerCase()]: 'bg-yellow-100 text-yellow-800',
      [STATUS_TYPES.INVOICE.OVERDUE.toLowerCase()]: 'bg-red-100 text-red-800',
      [STATUS_TYPES.APPOINTMENT.CANCELLED.toLowerCase()]: 'bg-red-100 text-red-800',
      [STATUS_TYPES.MESSAGE.FAILED.toLowerCase()]: 'bg-red-100 text-red-800',
      [STATUS_TYPES.PATIENT.NEW.toLowerCase()]: 'bg-blue-100 text-blue-800',
    };
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getHealthColor = (health: string) => {
    const healthMap: Record<string, string> = {
      [SYSTEM_HEALTH.EXCELLENT]: 'text-green-600',
      [SYSTEM_HEALTH.GOOD]: 'text-blue-600',
      [SYSTEM_HEALTH.WARNING]: 'text-yellow-600',
      [SYSTEM_HEALTH.CRITICAL]: 'text-red-600',
    };
    
    return healthMap[health] || 'text-gray-600';
  };

  // Button handlers
  const handleRefresh = () => {
    refetch();
    success('Dashboard data refreshed successfully');
  };

  const handleAddPatient = () => {
    success('Redirecting to add new patient...');
    // In a real app, this would navigate to the patients page
  };

  const handleScheduleAppointment = () => {
    success('Redirecting to schedule appointment...');
    // In a real app, this would navigate to the appointments page
  };

  const handleCreateBill = () => {
    success('This feature will be available in a future version');
    // This feature is not available in this version
  };

  const handleSendMessage = () => {
    success('This feature will be available in a future version');
    // This feature is not available in this version
  };

  const handleViewInvoices = () => {
    success('This feature will be available in a future version');
    // This feature is not available in this version
  };

  const handleViewMessages = () => {
    success('This feature will be available in a future version');
    // This feature is not available in this version
  };

  const handleViewPatient = (patientId: string) => {
    success(`Viewing patient details for ID: ${patientId}`);
    // In a real app, this would navigate to patient details
  };

  const handleViewAppointment = (appointmentId: string) => {
    success(`Viewing appointment details for ID: ${appointmentId}`);
    // In a real app, this would navigate to appointment details
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading dashboard data...</h3>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dental practice management system</p>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="Refresh dashboard data">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
          </Tooltip>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(data.systemHealth)}`}>
            <div className={`w-2 h-2 rounded-full ${data.systemHealth === 'excellent' ? 'bg-green-500' : data.systemHealth === 'good' ? 'bg-blue-500' : data.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            System Health: {data.systemHealth}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalPatients}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +{data.newPatientsThisMonth} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{data.todayAppointments}</p>
                <p className="text-xs text-gray-500">
                  {data.appointmentStats.completed} completed
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.monthlyRevenue)}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold text-gray-900">{data.satisfactionScore}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Excellent rating
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Doctors</p>
                <p className="text-xl font-bold">{data.activeDoctors}/{data.totalDoctors}</p>
              </div>
              <UserCheck className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-xl font-bold">{formatCurrency(data.pendingPayments)}</p>
              </div>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-xl font-bold text-green-600">Online</p>
              </div>
              <Settings className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-xl font-bold">{data.activeServices}/{data.totalServices}</p>
              </div>
              <Settings className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleViewPatient(patient.id)}
                >
                  <div>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Last visit: {formatDate(patient.lastVisit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleViewAppointment(appointment.id)}
                >
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type} with {appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <p className="text-xs text-gray-500">{formatDate(appointment.date)}</p>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Top Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topDoctors.map((doctor, index) => (
                <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{doctor.totalPatients} patients</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Tooltip content="Add a new patient to the system">
                <Button 
                  onClick={handleAddPatient}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Add Patient</span>
                </Button>
              </Tooltip>
              <Tooltip content="Schedule a new appointment">
                <Button 
                  variant="outline" 
                  onClick={handleScheduleAppointment}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Schedule</span>
                </Button>
              </Tooltip>
              <Tooltip content="Add a new service">
                <Button 
                  variant="outline" 
                  onClick={() => success('Redirecting to add new service...')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Add Service</span>
                </Button>
              </Tooltip>
              <Tooltip content="Add a new doctor">
                <Button 
                  variant="outline" 
                  onClick={() => success('Redirecting to add new doctor...')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="text-xs">Add Doctor</span>
                </Button>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">System Status</p>
              <p className="text-sm text-blue-600">
                All core features are operational. Billing and communication features will be available in future updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
