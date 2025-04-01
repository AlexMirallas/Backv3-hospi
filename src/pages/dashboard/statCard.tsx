import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';


interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value?: number;
    isLoading: boolean;
    error?: any;
    color?: string; 
}


export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, isLoading, error, color = '#3f51b5' }) => {
    if (error) {
        return (
            <Card sx={{ borderLeft: `5px solid red`, my: 1 }}>
                <CardHeader title={title} />
                <CardContent>
                    <Typography color="error" variant="body2">Error fetching data.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ borderLeft: `5px solid ${color}`, my: 1 }}>
            <CardHeader
                title={title}
                avatar={<Icon sx={{ fontSize: 40, color: color }} />} // Display icon
            />
            <CardContent>
                <Typography variant="h4" component="p" align="right">
                    {isLoading ? '...' : value ?? 0} {/* Display loading indicator or value */}
                </Typography>
            </CardContent>
        </Card>
    );
};