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
import { formatCurrency } from '../utils/formatters';
import { ServicesAPI } from '../lib/api';
import { 
  Settings, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  DollarSign,
  Filter,
  Tag
} from 'lucide-react';

interface Service {
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

export default function Services() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const { toasts, removeToast, success, error: showError } = useToast();

  // Fetch services data
  const { data: services, isLoading, error, refetch } = useDataFetch(
    () => ServicesAPI.getAll(searchTerm, categoryFilter === 'ALL' ? undefined : categoryFilter)
  );

  // Search and filter functionality
  const { filteredData: filteredServices } = useSearchAndFilter(
    services || [],
    ['name', 'description', 'category']
  );

  const handleAddService = () => {
    setIsAddModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    success(`Viewing details for ${service.name}`);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await ServicesAPI.delete(serviceId);
        success('Service deleted successfully');
        refetch();
      } catch (error) {
        showError('Failed to delete service');
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

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Preventive': 'bg-blue-100 text-blue-800',
      'Restorative': 'bg-green-100 text-green-800',
      'Cosmetic': 'bg-purple-100 text-purple-800',
      'Surgical': 'bg-red-100 text-red-800',
      'Orthodontic': 'bg-yellow-100 text-yellow-800',
      'Emergency': 'bg-orange-100 text-orange-800',
    };
    
    return categoryMap[category] || 'bg-gray-100 text-gray-800';
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load services</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your dental services and pricing</p>
        </div>
        <Button onClick={handleAddService} leftIcon={<Plus className="h-4 w-4" />}>
          Add Service
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
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Preventive">Preventive</option>
                <option value="Restorative">Restorative</option>
                <option value="Cosmetic">Cosmetic</option>
                <option value="Surgical">Surgical</option>
                <option value="Orthodontic">Orthodontic</option>
                <option value="Emergency">Emergency</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Services ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first service'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddService} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Service
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-gray-500">{service.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(Number(service.price))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(service.isActive)}>
                        {getStatusText(service.isActive)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewService(service)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
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

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Service"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <Input placeholder="Enter service name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input placeholder="Enter service description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select>
              <option value="">Select a category</option>
              <option value="Preventive">Preventive</option>
              <option value="Restorative">Restorative</option>
              <option value="Cosmetic">Cosmetic</option>
              <option value="Surgical">Surgical</option>
              <option value="Orthodontic">Orthodontic</option>
              <option value="Emergency">Emergency</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <Input type="number" placeholder="60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <Input type="number" step="0.01" placeholder="150.00" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              success('Service added successfully');
              setIsAddModalOpen(false);
              refetch();
            }}>
              Add Service
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Service"
      >
        {selectedService && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <Input defaultValue={selectedService.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input defaultValue={selectedService.description || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select defaultValue={selectedService.category}>
                <option value="Preventive">Preventive</option>
                <option value="Restorative">Restorative</option>
                <option value="Cosmetic">Cosmetic</option>
                <option value="Surgical">Surgical</option>
                <option value="Orthodontic">Orthodontic</option>
                <option value="Emergency">Emergency</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <Input type="number" defaultValue={selectedService.duration} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <Input type="number" step="0.01" defaultValue={selectedService.price} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                success('Service updated successfully');
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