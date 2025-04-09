import * as React from 'react';

import { Title, useGetList, Loading } from 'react-admin';
import { Box, Grid, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import PeopleIcon from '@mui/icons-material/People';       
import CategoryIcon from '@mui/icons-material/Category';   
import { WelcomeMessage } from './Components/welcomeMessage';
// import { ProductsPerCategoryChart } from './productsPerCategory';
import { QuickActions } from './Components/quickActions'; 
import { RecentUsers } from './Components/recentUsers';
import { StatCard } from './Components/statCard';
import { LowStockVariants } from './Components/LowStockProducts';





// The Main Dashboard Component
export const Dashboard: React.FC = () => {
    // Fetch total counts for different resources using useGetList
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

    

    // Combine loading states
    const isLoading = productsLoading || usersLoading || categoriesLoading ;

    // Simple loading state for the whole dashboard
    if (isLoading) {
        return <Loading />;
    }

    if (productsError || usersError || categoriesError) {
         console.error("Dashboard Errors:", { productsError, usersError, categoriesError });
        
         
    }


    return (
        <Box sx={{ p: 2 }}> 
            <Title title="Dashboard" /> 
            <WelcomeMessage/> {/* Custom Welcome message  */}
            <QuickActions/> {/* Quick actions for creating new items */}

            {/* Overview Section */}
            <Typography variant="h5" gutterBottom>
                Overview
            </Typography>

            {/* Grid for Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={ShoppingCartIcon}
                        title="Total Products"
                        value={productTotal}
                        isLoading={productsLoading}
                        error={productsError}
                        color="#4caf50" // Green
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={PeopleIcon}
                        title="Total Users"
                        value={usersTotal}
                        isLoading={usersLoading}
                        error={usersError}
                        color="#2196f3" // Blue
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={CategoryIcon}
                        title="Total Categories"
                        value={categoriesTotal}
                        isLoading={categoriesLoading}
                        error={categoriesError}
                        color="#ff9800" // Orange
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}> 
                    <LowStockVariants /> {/* Low stock products */}
                </Grid>
                <Grid item xs={12} md={4}> {/* Feed takes less space */}
                    <RecentUsers />
                </Grid>
            </Grid>
        </Box>
    );
};