import { useGetIdentity } from 'react-admin';
import { Typography, Avatar, Box } from '@mui/material';

export const WelcomeMessage = () => {
    const { identity, isLoading, error } = useGetIdentity();

    if (isLoading || error || !identity) return null; 

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
             {identity.avatar && <Avatar src={identity.avatar} sx={{ mr: 1 }} />}
             <Typography variant="h6">
                 Welcome back, {identity.fullName || identity.username || 'Admin'}!
             </Typography>
        </Box>
    );
};

