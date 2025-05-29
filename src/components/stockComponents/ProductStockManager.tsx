import { useState, useCallback } from 'react';
import {
    useRecordContext,
    NumberField,
    ReferenceManyField,
    Datagrid,
    DateField,
    TextField,
    ChipField,
    Pagination,
    Loading,
    Button,
    useNotify,
    DeleteButton,
    EditButton,
} from 'react-admin';
import { Box, Typography, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { ProductRecord } from '../../types/types'; 
import { StockAdjustmentModal } from './StockAdjustmentModal'; 

export const ProductStockManager = () => {
    const record = useRecordContext<ProductRecord>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notify = useNotify();

    const handleOpenModal = useCallback(() => {
        if (!record?.trackInventory) {
            notify("Inventory tracking is disabled for this product.", { type: 'warning' });
            return;
        }
        setIsModalOpen(true);
    }, [record, notify]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (!record) return <Loading />;

    if (!record.trackInventory) {
        return <Typography sx={{mt: 2}}>Inventory tracking is disabled for this product.</Typography>;
    }

    return (
        <Box pt={1} mt={2} sx={{ width: '100%' }}>
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6">Stock de produits actuel:</Typography>
                    <NumberField
                        record={record}
                        source="currentStock" 
                        sx={{ fontSize: '1.5em', fontWeight: 'bold' }}
                        emptyText="N/A"
                    />
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Button
                        variant="outlined"
                        onClick={handleOpenModal}
                        startIcon={<AddShoppingCartIcon />}
                        disabled={!record.trackInventory}
                    >
                        Adjust Product Stock
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom mt={3}>
                Product Stock Movement History
            </Typography>
            <ReferenceManyField
                label={false}
                reference="stock-movements"
                target="productId" 
                source="id" 
                sort={{ field: 'movementDate', order: 'DESC' }}
                pagination={<Pagination />}
                perPage={10}
            >
                <Datagrid bulkActionButtons={false} optimized rowClick="edit">
                    <DateField source="movementDate" label="Date" showTime />
                    <ChipField source="movementType" label="Type" />
                    <NumberField source="quantityChange" label="Change" options={{ signDisplay: 'always' }} />
                    <TextField source="reason" label="Reason" />
                    <EditButton label="Modifier" />
                    <DeleteButton
                        label="Supprimer"
                        redirect={false} 
                        mutationMode="optimistic" 
                        sx={{ minWidth: '100px' }}
                    />
                    
                </Datagrid>
            </ReferenceManyField>

            <StockAdjustmentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={record} 
            />
        </Box>
    );
};