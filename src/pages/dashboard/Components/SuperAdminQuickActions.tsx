import { CreateButton } from 'react-admin';
import {  Box } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';


export const SuperAdminQuickActions = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <CreateButton
            resource="clients"
            label="Créer un nouveau client"
            icon={<GroupAddIcon />}
            variant="contained"
         />
    </Box>
);