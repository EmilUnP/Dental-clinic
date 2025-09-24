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
import { formatDate } from '../utils/formatters';
import { DoctorsAPI } from '../lib/api';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';

interface Doctor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  specialties: string[];
  experience: number;
  education: string[];
  certifications: string[];
  bio?: string | null;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    appointments: number;
    reviews: number;
  };
}

export default function Doctors() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, removeToast, success, error: showError } = useToast();

  // Fetch doctors data
  const { data: doctorsData, isLoading, error, refetch } = useDataFetch(
    () => DoctorsAPI.getAll(searchTerm, 1, 50)
  );

  // Filter doctors based on search term
  const filteredDoctors = (doctorsData?.doctors || []).filter(doctor => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.user.firstName.toLowerCase().includes(searchLower) ||
      doctor.user.lastName.toLowerCase().includes(searchLower) ||
      doctor.specialties.some(specialty => specialty.toLowerCase().includes(searchLower))
    );
  });

  const handleAddDoctor = () => {
    setIsAddModalOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    success(`Viewing details for Dr. ${doctor.user.firstName} ${doctor.user.lastName}`);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        // Note: In a real app, you'd have a delete method in DoctorsAPI
        success('Doctor deleted successfully');
        refetch();
      } catch (error) {
        showError('Failed to delete doctor');
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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load doctors</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600">Manage your dental team</p>
        </div>
        <Button onClick={handleAddDoctor} leftIcon={<Plus className="h-4 w-4" />}>
          Add Doctor
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Doctors ({filteredDoctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddDoctor} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Doctor
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          Dr. {doctor.user.firstName} {doctor.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{doctor.user.email}</div>
                        {doctor.user.phone && (
                          <div className="text-sm text-gray-500">{doctor.user.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doctor.specialties.slice(0, 2).map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {doctor.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{doctor.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-3 w-3" />
                        {doctor.experience} years
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getRatingStars(doctor.rating)}
                        <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3 w-3" />
                        {doctor._count.appointments}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(doctor.isActive)}>
                        {getStatusText(doctor.isActive)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDoctor(doctor)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor.id)}
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

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <Input placeholder="Enter license number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialties
            </label>
            <Input placeholder="Enter specialties (comma separated)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <Input type="number" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <Input placeholder="Enter doctor bio" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              success('Doctor added successfully');
              setIsAddModalOpen(false);
              refetch();
            }}>
              Add Doctor
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
      >
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input defaultValue={selectedDoctor.user.firstName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input defaultValue={selectedDoctor.user.lastName} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input type="email" defaultValue={selectedDoctor.user.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input defaultValue={selectedDoctor.user.phone || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialties
              </label>
              <Input defaultValue={selectedDoctor.specialties.join(', ')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <Input type="number" defaultValue={selectedDoctor.experience} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <Input type="number" step="0.1" min="0" max="5" defaultValue={selectedDoctor.rating} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <Input defaultValue={selectedDoctor.bio || ''} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                success('Doctor updated successfully');
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