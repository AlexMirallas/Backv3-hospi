import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useGetList } from 'react-admin';

export const ProductsPerCategoryChart = () => {
    const { data, total, isLoading, error } = useGetList(
        'categories/stats', 
        {
            pagination: { page: 1, perPage: 5 },
            sort: { field: 'productCount', order: 'DESC' },
            filter: { productCount: { $gt: 0 } } 
        }
    );

    console.log('Category chart data fetched:', data);

    if (isLoading) return <Card><CardContent><Typography>Loading chart...</Typography></CardContent></Card>;
    if (error || data === null) return <Card><CardContent><Typography color="error">Could not load chart data.</Typography></CardContent></Card>;
    if (!data || data.length === 0) return <Card><CardContent><Typography>No category data available for chart.</Typography></CardContent></Card>;

    const chartData = data.map(category => ({
        name: category.name,
        Products: category.productCount
    }));

    return (
        <Card>
            <CardHeader title={`Top ${total ? Math.min(total, 10) : ''} Categories by Product Count`} />
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {chartData.length > 0 ? (
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Products" fill="#8884d8" />
                        </BarChart>
                    ) : (
                        <Typography>No chart data to display.</Typography>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
