// src/context/DashboardFilterContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface DashboardFilterState {
  year: string;
  academic: string;
  academicType?: number; // 1 for school, 2/3 for college
  ApplicationStatus?: 'captured' | 'initialized' | null;
  CountStatus?: 'captured' | 'initialized' | null;
  academicName?: string;
}

interface DashboardFilterContextType {
  filters: DashboardFilterState;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilterState>>;
  updateFilter: (key: keyof DashboardFilterState, value: any) => void;
  resetFilters: () => void;
}

const defaultFilters: DashboardFilterState = {
  year: new Date().getFullYear().toString(),
  academic: '',
  academicType: undefined,
  ApplicationStatus: null,
  CountStatus: null,
  academicName: ''
};

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export const DashboardFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<DashboardFilterState>(defaultFilters);

  const updateFilter = (key: keyof DashboardFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <DashboardFilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </DashboardFilterContext.Provider>
  );
};

export const useDashboardFilters = () => {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error('useDashboardFilters must be used within DashboardFilterProvider');
  }
  return context;
};