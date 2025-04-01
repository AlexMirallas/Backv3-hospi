import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useGetList } from 'react-admin'; // Or useGetList if applicable

export const ProductsPerCategoryChart = () => {
    // Example: Fetch data from a custom endpoint /api/stats/products-per-category
    const { data, isLoading, error } = useGetList(
        'products',{
            pagination: { page: 1, perPage: 10 }, 
            sort: { field: 'count', order: 'DESC' }, 
            filter: {} 
        });

    if (isLoading) return <Typography>Loading chart...</Typography>;
    if (error || !data) return <Typography color="error">Could not load chart data.</Typography>;

    // Assuming data looks like: [{ categoryName: 'Electronics', count: 50 }, ...]
    const chartData = data.map(item => ({ name: item.categoryName, Products: item.count }));

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