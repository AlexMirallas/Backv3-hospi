import {
    useGetList,
    Loading,
    ReferenceField, 
    TextField
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom'; 
import {
    Card,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar, 
    Avatar,
    Typography,
    Box,
    Link
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import { RefreshButton } from '../../../components/buttons-icons/RefreshButton';

const MAX_STOCK_THRESHOLD = 10; 
const ITEMS_TO_SHOW = 5; 

export const LowStockVariants: React.FC = (props) => {
    const { data, total, isLoading, error, refetch } = useGetList(
        'variants', 
        {
            pagination: { page: 1, perPage: ITEMS_TO_SHOW }, 
            sort: { field: 'stockQuantity', order: 'ASC' }, 
            filter: { stockQuantity: MAX_STOCK_THRESHOLD }
        }
    );

    if (isLoading) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardHeader title="Low Stock Products" />
                <Loading loadingPrimary="Loading low stock variants..." />
            </Card>
        );
    }
    if (error) {
        console.error("Error fetching low stock variants:", error);
        return (
            <Card sx={{ mt: 2 }}>
                <CardHeader title="Low Stock Products" />
                 <Box sx={{ p: 2 }}>
                 <Typography variant="body2">Error fetching data</Typography>
                 </Box>
            </Card>
        );
    }
    if (!data || data.length === 0) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardHeader title="Low Stock Products" />
                 <Box sx={{ p: 2 }}>
                    <Typography variant="body2">No products currently low on stock.</Typography>
                    <Box sx={{ mt: 1, textAlign: 'right' }}>
                        <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
                    </Box>
                 </Box>
            </Card>
        );
    }

    return (
        <Card sx={{ mt: 2 }}>
            <CardHeader title={`Low Stock Products (Under ${MAX_STOCK_THRESHOLD} items) `} />
            <List {...props} dense={true}> 
                {data.map(variant => (
                    <ListItem
                        key={variant.id}
                        component={RouterLink} 
                        to={`/variants/${variant.id}`} 
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'red' }}> 
                                <InventoryIcon fontSize="small" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`SKU: ${variant.sku || 'N/A'}`}
                            secondary={
                                <>
                                    Stock: {variant.stockQuantity}                               
                                    {variant.product?.name && ` | Product: ${variant.product.name}`}
                                    {!variant.product?.name && variant.productId && (
                                        <>
                                            {' | Product: '}
                                            <ReferenceField
                                                record={variant}
                                                source="productId"
                                                reference="products" 
                                                link={false} 
                                            >
                                                <TextField source="name" sx={{ display: 'inline' }} />
                                            </ReferenceField>
                                        </>
                                    )}
                                </>
                            }
                        />
                    </ListItem>
                ))}
                <Box sx={{ p: 2, textAlign: 'right' }}>
                    <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
                </Box>
            </List>
             {(total ?? 0) > ITEMS_TO_SHOW && (
                 <Box sx={{ p: 2, textAlign: 'right' }}>
                      <Link
                          component={RouterLink}
                          to={`/variants?filter=${JSON.stringify({ stockQuantity: MAX_STOCK_THRESHOLD })}&sort=stockQuantity&order=ASC`}
                          underline="hover"
                      >
                          See all low stock products
                      </Link>
                 </Box>
             )}
        </Card>
    );
};