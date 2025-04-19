import * as React from 'react';
import { Title, useGetList, Loading } from 'react-admin';
import { Box, Grid, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business'; // Icon for clients
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for active
import CancelIcon from '@mui/icons-material/Cancel'; // Icon for inactive
import { WelcomeMessage } from './Components/welcomeMessage';
import { SuperAdminQuickActions } from './Components/SuperAdminQuickActions'; 
import { StatCard } from './Components/statCard';
import PauseCircleIcon from '@mui/icons-material/PauseCircleFilled'; // Icon for suspended
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon for deleted

export const SuperAdminDashboard: React.FC = () => {
    const pagination = { page: 1, perPage: 1 }; // For fetching totals

    // Fetch total clients
    const { total: clientsTotal, isLoading: clientsLoading, error: clientsError } = useGetList(
        'clients', { pagination }
    );

    // Fetch active clients
    const { total: activeTotal, isLoading: activeLoading, error: activeError } = useGetList(
        'clients', { pagination, filter: { status: 'active' } } // Assuming 'active' status
    );

    // Fetch inactive clients (optional, could be calculated)
    const { total: inactiveTotal, isLoading: inactiveLoading, error: inactiveError } = useGetList(
        'clients', { pagination, filter: { status: 'inactive' } } // Assuming 'inactive' status
    );

    const { total: suspendedTotal, isLoading: suspendedLoading, error: suspendedError } = useGetList(
        'clients', { pagination, filter: { status: 'suspended' } }
    );
    const { total: deletedTotal, isLoading: deletedLoading, error: deletedError } = useGetList(
        'clients', { pagination, filter: { status: 'deleted' } }
    );

    // Combine loading states
    const isLoading = clientsLoading || activeLoading || inactiveLoading || suspendedLoading || deletedLoading;

    if (isLoading) {
        return <Loading />;
    }

    // Handle potential errors
    if (clientsError || activeError || inactiveError) {
         console.error("SuperAdmin Dashboard Errors:", { clientsError, activeError, inactiveError });   
         // Optionally display an error message to the user
    }

    // Calculate inactive if not fetched directly
    // const calculatedInactiveTotal = (clientsTotal ?? 0) - (activeClientsTotal ?? 0);

    return (
        <Box sx={{ p: 2 }}> 
            <Title title="Super Admin Dashboard" /> 
            <WelcomeMessage/> 
            <SuperAdminQuickActions/> 

            <Typography variant="h5" gutterBottom>
                Client Overview
            </Typography>

            {/* Grid for Client Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}> {/* Adjusted grid size */}
                    <StatCard
                        icon={BusinessIcon}
                        title="Total Clients"
                        value={clientsTotal}
                        isLoading={clientsLoading}
                        error={clientsError}
                        color="#673ab7" // Purple
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}> {/* Adjusted grid size */}
                    <StatCard
                        icon={CheckCircleIcon}
                        title="Active Clients"
                        value={activeTotal}
                        isLoading={activeLoading}
                        error={activeError}
                        color="#4caf50" // Green
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={CancelIcon} // Using Cancel for Inactive
                        title="Inactive Clients"
                        value={inactiveTotal}
                        isLoading={inactiveLoading} 
                        error={inactiveError} 
                        color="#ff9800" // Orange
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={PauseCircleIcon} // Using Pause for Suspended
                        title="Suspended Clients"
                        value={suspendedTotal}
                        isLoading={suspendedLoading}
                        error={suspendedError}
                        color="#ffc107" // Amber
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}> 
                    <StatCard
                        icon={DeleteForeverIcon} // Using Delete for Deleted
                        title="Deleted Clients"
                        value={deletedTotal}
                        isLoading={deletedLoading}
                        error={deletedError}
                        color="#f44336" // Red
                    />
                </Grid>
            </Grid>

            {/* Add other superadmin-specific components here */}
            {/* Example:
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}> 
                    <RecentClients /> 
                </Grid>
                <Grid item xs={12} md={6}> 
                    {/* Another client-related component *}
                </Grid>
            </Grid>
            */}
        </Box>
    );
};