import { 
    FilterList, 
    FilterListItem, 
    usePermissions, 
    useGetList,
} from 'react-admin';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { statusChoices } from '../enums/enums';

export const SuperAdminClientFilterList = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    
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

    if (!isSuperAdmin) {
        return null;
    }

    const clientsByStatus = {
        active: clients?.filter(client => client.status === 'active') || [],
        inactive: clients?.filter(client => client.status === 'inactive') || [],
        suspended: clients?.filter(client => client.status === 'suspended') || [],
        deleted: clients?.filter(client => client.status === 'deleted') || [],
    };

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


                {Object.entries(clientsByStatus).map(([status, statusClients]) => {
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