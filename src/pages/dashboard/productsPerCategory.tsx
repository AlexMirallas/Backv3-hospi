import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useGetList } from 'react-admin'; 

export const ProductsPerCategoryChart = () => {
    // Fetching data from the API using react-admin's useGetList hook
    const { data, isLoading, error } = useGetList(
        'products',{
            pagination: { page: 1, perPage: 10 }, 
            sort: { field: 'count', order: 'DESC' }, 
            filter: {} 
        });
    console.log('Chart data:', data);
    console.log(data?.map(item => item.categories.name));
    
    if (isLoading) return <Typography>Loading chart...</Typography>;
    if (error || !data) return <Typography color="error">Could not load chart data.</Typography>;

    if (data.length === 0) return <Typography>No data available for chart.</Typography>;
    const chartData = data.map(item => ({ name: item.categories.name, Products: item.count }));

    return (
        <Card>
            <CardHeader title="Products per Category" />
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Products" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};