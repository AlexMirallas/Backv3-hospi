import React, { useState, useCallback } from 'react';
import {
    useRecordContext, // Can be used if this component is a child of a Variant context provider
    NumberField,
    ReferenceManyField,
    Datagrid,
    DateField,
    TextField,
    ChipField,
    Pagination,
    ReferenceField,
    Loading,
    Button,
    useNotify,
    useRefresh,
} from 'react-admin';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { ProductVariantRecord } from '../../types/types'; // Adjust path as needed
import { StockAdjustmentModal } from './StockAdjustmentModal'; // Adjust path

interface VariantStockManagerProps {
    variant: ProductVariantRecord; // Accept variant as a prop
    productTrackInventory: boolean; // Know if parent product tracks inventory
}

export const VariantStockManager: React.FC<VariantStockManagerProps> = ({ variant, productTrackInventory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notify = useNotify();
    // const refresh = useRefresh(); // Refresh might be handled by parent or modal

    const handleOpenModal = useCallback(() => {
        if (!productTrackInventory) {
             notify("Inventory tracking is disabled for the parent product.", { type: 'warning' });
             return;
        }
        setIsModalOpen(true);
    }, [productTrackInventory, notify]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (!variant) return <Loading />;

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Variant SKU: {variant.sku || 'N/A'}</Typography>
            <Grid container spacing={2} alignItems="center" mb={1}>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography variant="body1">Current Variant Stock:</Typography>
                    <NumberField
                        record={variant} // Use the passed variant record
                        source="stockLevel.quantity" // Assumes variant record has stockLevel.quantity
                        sx={{ fontSize: '1.2em', fontWeight: 'bold' }}
                        emptyText="N/A"
                    />
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpenModal}
                        startIcon={<AddShoppingCartIcon />}
                        disabled={!productTrackInventory}
                    >
                        Adjust Variant Stock
                    </Button>
                </Grid>
            </Grid>

            {productTrackInventory && (
                <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom mt={1}>
                        Variant Stock Movement History
                    </Typography>
                    <ReferenceManyField
                        label={false}
                        reference="stock-movements"
                        target="variantId" // Target variant ID
                        source="id" // Variant's ID
                        sort={{ field: 'movementDate', order: 'DESC' }}
                        pagination={<Pagination perPage={5} />} // Smaller pagination for variants
                        perPage={5}
                    >
                        <Datagrid bulkActionButtons={false} size="small" optimized rowClick="show">
                            <DateField source="movementDate" label="Date" showTime />
                            <ChipField source="movementType" label="Type" />
                            <NumberField source="quantityChange" label="Change" options={{ signDisplay: 'always' }} />
                            <TextField source="reason" label="Reason" />
                            {/* <ReferenceField source="userId" reference="users" link={false} label="User">
                                <TextField source="fullName" />
                            </ReferenceField> */}
                        </Datagrid>
                    </ReferenceManyField>
                </>
            )}

            <StockAdjustmentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                variant={variant} // Pass the variant record
            />
        </Paper>
    );
};