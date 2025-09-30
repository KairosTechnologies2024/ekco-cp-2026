import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Breadcrumb = {
  label: string;
  path: string;
  // You can add icon or other properties here if desired
};

interface BreadcrumbsContextProps {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(undefined);

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{
    label: 'Dashboard',
    path: '/dashboard'
  }]);

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbsContext);
  if (ctx === undefined) throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  return ctx;
}
