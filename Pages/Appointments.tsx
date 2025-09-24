import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { useDataFetch, useSearchAndFilter } from '../hooks/useDataFetch';
import { formatDate, formatTime } from '../utils/formatters';
import { AppointmentsAPI } from '../lib/api';
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  User,
  Stethoscope,
  Filter
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  notes?: string | null;
  reason?: string | null;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  service: {
    name: string;
    duration: number;
  };
}

export default function Appointments() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { toasts, removeToast, success, error: showError } = useToast();

  // Fetch appointments data
  const { data: appointmentsData, isLoading, error, refetch } = useDataFetch(
    () => AppointmentsAPI.getAll({}, 1, 50)
  );

  // Filter appointments based on search term
  const filteredAppointments = (appointmentsData?.appointments || []).filter(appointment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.patient.firstName.toLowerCase().includes(searchLower) ||
      appointment.patient.lastName.toLowerCase().includes(searchLower) ||
      appointment.service.name.toLowerCase().includes(searchLower) ||
      appointment.doctor.user.firstName.toLowerCase().includes(searchLower) ||
      appointment.doctor.user.lastName.toLowerCase().includes(searchLower)
    );
  });

  const handleAddAppointment = () => {
    setIsAddModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    success(`Viewing appointment details for ${appointment.patient.firstName} ${appointment.patient.lastName}`);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await AppointmentsAPI.delete(appointmentId);
        success('Appointment deleted successfully');
        refetch();
      } catch (error) {
        showError('Failed to delete appointment');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'NO_SHOW': 'bg-gray-100 text-gray-800',
    };
    
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load appointments</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your appointment schedule</p>
        </div>
        <Button onClick={handleAddAppointment} leftIcon={<Plus className="h-4 w-4" />}>
          Schedule Appointment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointments ({filteredAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by scheduling your first appointment'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddAppointment} leftIcon={<Plus className="h-4 w-4" />}>
                  Schedule Appointment
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment: Appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.patient.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.service.name}</div>
                        <div className="text-sm text-gray-500">
                          {appointment.service.duration} minutes
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(appointment.date.toString())}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(appointment.startTime.toString())} - {formatTime(appointment.endTime.toString())}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
          </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Appointment"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <Select>
              <option value="">Select a patient</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <Select>
              <option value="">Select a doctor</option>
              <option value="1">Dr. Sarah Smith</option>
              <option value="2">Dr. Michael Johnson</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <Select>
              <option value="">Select a service</option>
              <option value="1">General Checkup</option>
              <option value="2">Teeth Cleaning</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <Input type="time" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <Input placeholder="Enter appointment reason" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              success('Appointment scheduled successfully');
              setIsAddModalOpen(false);
              refetch();
            }}>
              Schedule Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Appointment"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <Select defaultValue={selectedAppointment.patientId}>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <Select defaultValue={selectedAppointment.doctorId}>
                <option value="1">Dr. Sarah Smith</option>
                <option value="2">Dr. Michael Johnson</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <Select defaultValue={selectedAppointment.serviceId}>
                <option value="1">General Checkup</option>
                <option value="2">Teeth Cleaning</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <Input type="date" defaultValue={formatDate(selectedAppointment.date.toString(), 'ISO')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <Input type="time" defaultValue={formatTime(selectedAppointment.startTime.toString())} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select defaultValue={selectedAppointment.status}>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <Input defaultValue={selectedAppointment.reason || ''} placeholder="Enter appointment reason" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                success('Appointment updated successfully');
                setIsEditModalOpen(false);
                refetch();
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}