import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardAdmin } from './DashboardAdmin';
import { DashboardTransportista } from './DashboardTransportista';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.rol === 'admin') {
    return <DashboardAdmin />;
  }

  if (user?.rol === 'transportista') {
    return <DashboardTransportista />;
  }

  return null;
};
