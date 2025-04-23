import { useGetList } from 'react-admin';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Card, CardHeader, CardContent, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom'; 

export const RecentUsers = () => {
    const { data, isLoading, error } = useGetList(
        'users',
        {
            pagination: { page: 1, perPage: 5 },
            sort: { field: 'createdAt', order: 'DESC' }
        }
    );

    console.log("Recent Users Data:", data); 

    if (isLoading) return <CircularProgress size={20} />;
    if (error) return <Typography color="error">Error loading users.</Typography>;
    if (!data || data.length === 0) return <Typography>No recent users.</Typography>;

    return (
        <Card>
            <CardHeader title="Newest Users" />
            <CardContent>
                <List dense>
                    {data.map(user => (
                        <ListItem
                            key={user.id}
                            component={Link} 
                            to={`/users/${user.id}`}
                        >
                            <ListItemAvatar>
                                <Avatar src={user.avatarUrl }>
                                   {!user.avatarUrl && <PersonIcon />} 
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.lastName +" " + user.firstName || "Noname Error"} 
                                secondary={`Joined: ${new Date(user.createdAt).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};