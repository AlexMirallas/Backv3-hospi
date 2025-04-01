import { CreateButton } from 'react-admin';
import {  Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import GroupAddIcon from '@mui/icons-material/GroupAdd';


export const QuickActions = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <CreateButton
            resource="products"
            label="New Product"
            icon={<AddShoppingCartIcon />}
            variant="contained"
         />
         <CreateButton
            resource="users"
            label="New User"
            icon={<GroupAddIcon />}
            variant="outlined"
         />

         <CreateButton
            resource="categories"
            label="New Category"
            icon={<GroupAddIcon />}
            variant="outlined"
            />
    </Box>
);