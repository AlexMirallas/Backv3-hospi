import * as React from 'react';
import { Title, useGetList, Loading } from 'react-admin';
import { Box, Grid, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { WelcomeMessage } from './Components/welcomeMessage';
import { SuperAdminQuickActions } from './Components/SuperAdminQuickActions'; 
import { StatCard } from './Components/statCard';
import PauseCircleIcon from '@mui/icons-material/PauseCircleFilled';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const SuperAdminDashboard: React.FC = () => {
    const pagination = { page: 1, perPage: 1 };

    const { total: clientsTotal, isLoading: clientsLoading, error: clientsError } = useGetList(
        'clients', { pagination }
    );

    const { total: activeTotal, isLoading: activeLoading, error: activeError } = useGetList(
        'clients', { pagination, filter: { status: 'active' } }
    );

    const { total: inactiveTotal, isLoading: inactiveLoading, error: inactiveError } = useGetList(
        'clients', { pagination, filter: { status: 'inactive' } }
    );

    const { total: suspendedTotal, isLoading: suspendedLoading, error: suspendedError } = useGetList(
        'clients', { pagination, filter: { status: 'suspended' } }
    );
    const { total: deletedTotal, isLoading: deletedLoading, error: deletedError } = useGetList(
        'clients', { pagination, filter: { status: 'deleted' } }
    );

    const isLoading = clientsLoading || activeLoading || inactiveLoading || suspendedLoading || deletedLoading;

    if (isLoading) {
        return <Loading />;
    }

    if (clientsError || activeError || inactiveError) {
         console.error("SuperAdmin Dashboard Errors:", { clientsError, activeError, inactiveError });   
    }

    return (
        <Box sx={{ p: 2 }}> 
            <Title title="Super Admin Dashboard" /> 
            <WelcomeMessage/> 
            <SuperAdminQuickActions/> 

            <Typography variant="h5" gutterBottom>
                Client Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={BusinessIcon}
                        title="Total Clients"
                        value={clientsTotal}
                        isLoading={clientsLoading}
                        error={clientsError}
                        color="#673ab7"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={CheckCircleIcon}
                        title="Active Clients"
                        value={activeTotal}
                        isLoading={activeLoading}
                        error={activeError}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={CancelIcon}
                        title="Inactive Clients"
                        value={inactiveTotal}
                        isLoading={inactiveLoading} 
                        error={inactiveError} 
                        color="#ff9800"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={PauseCircleIcon}
                        title="Suspended Clients"
                        value={suspendedTotal}
                        isLoading={suspendedLoading}
                        error={suspendedError}
                        color="#ffc107"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={DeleteForeverIcon}
                        title="Deleted Clients"
                        value={deletedTotal}
                        isLoading={deletedLoading}
                        error={deletedError}
                        color="#f44336"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
