import React, { useState, useCallback } from 'react';
import {
    useRecordContext,
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
import { Box, Typography, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { ProductRecord } from '../../types/types'; // Adjust path as needed
import { StockAdjustmentModal } from './StockAdjustmentModal'; // Adjust path

export const ProductStockManager = () => {
    const record = useRecordContext<ProductRecord>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleOpenModal = useCallback(() => {
        if (!record?.trackInventory) {
            notify("Inventory tracking is disabled for this product.", { type: 'warning' });
            return;
        }
        setIsModalOpen(true);
    }, [record, notify]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        // No need to call refresh here, modal's onSuccess does it
    }, []);

    if (!record) return <Loading />;

    if (!record.trackInventory) {
        return <Typography sx={{mt: 2}}>Inventory tracking is disabled for this product.</Typography>;
    }

    return (
        <Box pt={1} mt={2}>
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography variant="h6">Current Product Stock:</Typography>
                    <NumberField
                        record={record}
                        source="stockLevel.quantity" // Assumes product record has stockLevel.quantity
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
                target="productId" // Target product ID
                filter={{ variantId: null }} // Ensure we only get movements for the product itself, not its variants
                source="id" // Product's ID
                sort={{ field: 'movementDate', order: 'DESC' }}
                pagination={<Pagination />}
                perPage={10}
            >
                <Datagrid bulkActionButtons={false} optimized rowClick="show">
                    <DateField source="movementDate" label="Date" showTime />
                    <ChipField source="movementType" label="Type" />
                    <NumberField source="quantityChange" label="Change" options={{ signDisplay: 'always' }} />
                    <TextField source="reason" label="Reason" />
                    <ReferenceField source="userId" reference="users" link={false} label="User">
                        <TextField source="fullName" /> {/* Adjust to your User record */}
                    </ReferenceField>
                    {/* Add sourceDocumentId/Type if needed */}
                </Datagrid>
            </ReferenceManyField>

            <StockAdjustmentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={record} // Pass the product record
            />
        </Box>
    );
};