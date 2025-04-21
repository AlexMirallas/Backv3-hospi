import { 
    FilterList, 
    FilterListItem, 
    usePermissions, 
    useGetList,
} from 'react-admin';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { statusChoices } from '../enums/enums';

export const SuperAdminClientFilterList = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    
    // Fetch all clients (we'll use them to create FilterListItems)
    const { 
        data: clients, 
        isLoading: clientsLoading, 
        error
    } = useGetList(
        'clients',
        { 
            pagination: { page: 1, perPage: 20 }, 
            sort: { field: 'name', order: 'ASC' }  
        }
    );

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    if (permissionsLoading || clientsLoading) {
        return (
            <Card sx={{ order: -1, mr: 2, mt: '4em', width: 280 }}>
                <CardContent>
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress size={24} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Handle error
    if (error) {
        console.error("Error loading clients:", error);
        return (
            <Card sx={{ order: -1, mr: 2, mt: '4em', width: 280 }}>
                <CardContent>
                    <Typography color="error">Error loading clients</Typography>
                </CardContent>
            </Card>
        );
    }

    // Only render for superadmins
    if (!isSuperAdmin) {
        return null;
    }

    // Group clients by status
    const clientsByStatus = {
        active: clients?.filter(client => client.status === 'active') || [],
        inactive: clients?.filter(client => client.status === 'inactive') || [],
        suspended: clients?.filter(client => client.status === 'suspended') || [],
        deleted: clients?.filter(client => client.status === 'deleted') || [],
    };

    // Get label for status from statusChoices
    const getStatusLabel = (statusId: string) => {
        const status = statusChoices.find(status => status.id === statusId);
        return status ? status.name : statusId;
    };

    return (
        <Card sx={{ order: -1, mr: 2, mt: '4em', width: 280 }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Client Filters
                </Typography>

                {/* Recent Clients Filter Group */}
                <FilterList 
                    label="Recent Clients" 
                    icon={<AccessTimeIcon />}
                >
                    <FilterListItem
                        label="All Clients"
                        value={{}}
                    />
                </FilterList>

                {/* Status-based Clients Filter Groups */}
                {Object.entries(clientsByStatus).map(([status, statusClients]) => {
                    // Skip empty status groups
                    if (statusClients.length === 0) return null;

                    return (
                        <FilterList
                            key={status}
                            label={getStatusLabel(status)}
                            icon={<BusinessIcon />}
                        >
                            {statusClients.map(client => (
                                <FilterListItem
                                    key={client.id}
                                    label={client.name}
                                    value={{ clientId: client.id }}
                                />
                            ))}
                        </FilterList>
                    );
                })}
            </CardContent>
        </Card>
    );
};