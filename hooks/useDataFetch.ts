import { useState, useEffect, useCallback } from 'react';

/**
 * Data fetching hook result
 */
export interface UseDataFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setData: (data: T | null) => void;
}

/**
 * Options for data fetching
 */
export interface UseDataFetchOptions {
  immediate?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Custom hook for data fetching with loading states and error handling
 */
export function useDataFetch<T>(
  fetchFunction: () => Promise<T>,
  options: UseDataFetchOptions = {}
): UseDataFetchResult<T> {
  const {
    immediate = true,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (attempt: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      if (attempt < retryAttempts) {
        // Retry after delay
        setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * attempt);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, retryAttempts, retryDelay]);

  const refetch = useCallback(() => {
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData(1);
    }
  }, [immediate, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    setData,
  };
}

/**
 * Hook for managing form state with validation
 */
export function useFormState<T extends Record<string, any>>(
  initialData: T,
  validationRules?: Record<keyof T, (value: any) => { isValid: boolean; errors: string[] }>
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]?.length > 0) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  }, [errors]);

  const validateField = useCallback((field: keyof T) => {
    if (!validationRules?.[field]) return;

    const result = validationRules[field](formData[field]);
    setErrors(prev => ({ ...prev, [field]: result.errors }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    return result.isValid;
  }, [formData, validationRules]);

  const validateForm = useCallback(() => {
    if (!validationRules) return true;

    let isValid = true;
    const newErrors = { ...errors };

    for (const field of Object.keys(validationRules) as Array<keyof T>) {
      const result = validationRules[field](formData[field]);
      newErrors[field] = result.errors;
      if (!result.isValid) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof T, boolean>));
    
    return isValid;
  }, [formData, validationRules, errors]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({} as Record<keyof T, string[]>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialData]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  return {
    formData,
    errors,
    touched,
    updateField,
    validateField,
    validateForm,
    resetForm,
    setFieldTouched,
    setFormData,
  };
}

/**
 * Hook for managing search and filter state
 */
export function useSearchAndFilter<T>(
  data: T[],
  searchFields: Array<keyof T>,
  filterFields?: Array<keyof T>
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = data.filter(item => {
    // Search filter
    if (searchTerm) {
      const matchesSearch = searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
      if (!matchesSearch) return false;
    }

    // Field filters
    if (filterFields) {
      for (const field of filterFields) {
        const filterValue = filters[field as string];
        if (filterValue && filterValue !== 'All') {
          const itemValue = item[field];
          if (typeof itemValue === 'string' && itemValue !== filterValue) {
            return false;
          }
        }
      }
    }

    return true;
  });

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  }) : filteredData;

  const updateFilter = useCallback((field: keyof T, value: string) => {
    setFilters(prev => ({ ...prev, [field as string]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const handleSort = useCallback((field: keyof T) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    sortOrder,
    handleSort,
    filteredData: sortedData,
  };
}
