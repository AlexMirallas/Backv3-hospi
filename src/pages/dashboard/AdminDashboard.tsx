import React from 'react';

import { Title, useGetList, Loading } from 'react-admin';
import { Box, Grid, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import PeopleIcon from '@mui/icons-material/People';       
import CategoryIcon from '@mui/icons-material/Category';   
import { WelcomeMessage } from './Components/welcomeMessage';
import { AdminQuickActions } from './Components/AdminQuickActions'; 
import { RecentUsers } from './Components/recentUsers';
import { StatCard } from './Components/statCard';
import { LowStockVariants } from './Components/LowStockProducts';





export const AdminDashBoard: React.FC = () => {
    const pagination = { page: 1, perPage: 1 };

    const { total: productTotal, isLoading: productsLoading, error: productsError } = useGetList(
        'products',
        { pagination }
      
    );
    const { total: usersTotal, isLoading: usersLoading, error: usersError } = useGetList(
        'users',
        { pagination }
    );
    const { total: categoriesTotal, isLoading: categoriesLoading, error: categoriesError } = useGetList(
        'categories',
        { pagination }
    );
    
    const isLoading = productsLoading || usersLoading || categoriesLoading ;

    if (isLoading) {
        return <Loading />;
    }

    if (productsError || usersError || categoriesError) {
         console.error("Dashboard Errors:", { productsError, usersError, categoriesError });   
    }


    return (
        <Box sx={{ p: 2 }}> 
            <Title title="Dashboard" /> 
            <WelcomeMessage/> 
            <AdminQuickActions/> 

            <Typography variant="h5" gutterBottom>
                Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={ShoppingCartIcon}
                        title="Total Products"
                        value={productTotal}
                        isLoading={productsLoading}
                        error={productsError}
                        color="#4caf50" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={PeopleIcon}
                        title="Total Users"
                        value={usersTotal}
                        isLoading={usersLoading}
                        error={usersError}
                        color="#2196f3" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={CategoryIcon}
                        title="Total Categories"
                        value={categoriesTotal}
                        isLoading={categoriesLoading}
                        error={categoriesError}
                        color="#ff9800" 
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}> 
                    <LowStockVariants /> 
                </Grid>
                <Grid item xs={12} md={4}>
                    <RecentUsers />
                </Grid>
            </Grid>
        </Box>
    );
};