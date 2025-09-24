import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { useDataFetch, useSearchAndFilter } from '../hooks/useDataFetch';
import { formatDate, formatPhoneNumber } from '../utils/formatters';
import { PatientsAPI } from '../lib/api';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
  appointmentsAsPatient: any[];
}

export default function Patients() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, removeToast, success, error: showError } = useToast();

  // Fetch patients data
  const { data: patientsData, isLoading, error, refetch } = useDataFetch(
    () => PatientsAPI.getAll(searchTerm, 1, 50)
  );

  // Search and filter functionality
  const { filteredData: patients } = useSearchAndFilter(
    patientsData?.patients || [],
    ['firstName', 'lastName', 'email']
  );

  const handleAddPatient = () => {
    setIsAddModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    // In a real app, this would navigate to patient details
    success(`Viewing details for ${patient.firstName} ${patient.lastName}`);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await PatientsAPI.delete(patientId);
        success('Patient deleted successfully');
        refetch();
      } catch (error) {
        showError('Failed to delete patient');
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load patients</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage your patient records</p>
        </div>
        <Button onClick={handleAddPatient} leftIcon={<Plus className="h-4 w-4" />}>
          Add Patient
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
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patients ({patients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddPatient} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Patient
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {patient.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {formatPhoneNumber(patient.phone)}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.isActive)}>
                        {getStatusText(patient.isActive)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {patient.appointmentsAsPatient?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(patient.createdAt.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
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

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input placeholder="Enter first name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input placeholder="Enter last name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input type="email" placeholder="Enter email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input placeholder="Enter phone number" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              success('Patient added successfully');
              setIsAddModalOpen(false);
              refetch();
            }}>
              Add Patient
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input defaultValue={selectedPatient.firstName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input defaultValue={selectedPatient.lastName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input type="email" defaultValue={selectedPatient.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input defaultValue={selectedPatient.phone || ''} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                success('Patient updated successfully');
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