import React from 'react';
import { usePermissions,Loading } from 'react-admin';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { AdminDashBoard } from './AdminDashboard';


export const Dashboard: React.FC = () => {
    const { isLoading, permissions } = usePermissions();

    if (isLoading) {
        return <Loading />;
    }

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    return isSuperAdmin ? <SuperAdminDashboard /> : <AdminDashBoard />;
};

