// CustomersContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface CustomersContextType {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  isDeleteMode: boolean;
  setIsDeleteMode: (value: boolean) => void;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  return (
    <CustomersContext.Provider value={{ editMode, setEditMode, isDeleteMode, setIsDeleteMode }}>
      {children}
    </CustomersContext.Provider>
  );
};

// Custom hook for easier consumption
export const useCustomers = (): CustomersContextType => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};

export default CustomersContext;