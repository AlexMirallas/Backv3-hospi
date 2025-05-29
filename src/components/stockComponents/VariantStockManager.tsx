import React, { useState, useCallback } from 'react';
import {
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
} from 'react-admin';
import { Typography, Grid, Paper, Divider } from '@mui/material';
import { ProductVariantRecord } from '../../types/types'; 
import { StockAdjustmentModal } from './StockAdjustmentModal'; 

interface VariantStockManagerProps {
    variant: ProductVariantRecord; 
    productTrackInventory: boolean; 
}

export const VariantStockManager: React.FC<VariantStockManagerProps> = ({ variant, productTrackInventory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notify = useNotify();


    const handleOpenModal = useCallback(() => {
        if (!productTrackInventory) {
             notify("Le suivi des stocks est désactivé pour le produit parent.", { type: 'warning' });
             return;
        }
        setIsModalOpen(true);
    }, [productTrackInventory, notify]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (!variant) return <Loading />;

    return (
        <Paper  elevation={5} sx={{ p: 2, mb: 2, borderRadius: 2, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Produit SKU: {variant.sku || 'N/A'}</Typography>
            <Grid container spacing={2} alignItems="center" mb={1}>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography variant="body1">Stock de produits actuel:</Typography>
                    <NumberField
                        record={variant}
                        source="currentStock" 
                        sx={{ fontSize: '1.2em', fontWeight: 'bold' }}
                        emptyText="N/A"
                    />
                </Grid>
                <Grid item xs={10} sm={15} md={30}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpenModal}
                        disabled={!productTrackInventory}
                    >
                        Enregistrer un mouvement de stock
                    </Button>
                </Grid>
            </Grid>

            {productTrackInventory && (
                <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom mt={1}>
                        Historique des mouvements des stocks de {variant.sku || 'N/A'}
                    </Typography>
                    <ReferenceManyField
                        record ={variant} 
                        label={false}
                        reference="stock-movements"
                        target="variantId" 
                        source="id" 
                        sort={{ field: 'movementDate', order: 'DESC' }}
                        pagination={<Pagination />} 
                        perPage={5}
                    >
                        <Datagrid bulkActionButtons={false} size="small" optimized rowClick={false} >
                            <DateField source="movementDate" label="Date" showTime />
                            <ChipField source="movementType" label="Type" />
                            <NumberField source="quantityChange" label="Change" options={{ signDisplay: 'always' }} />
                            <TextField source="reason" label="Reason/Remarques" />
                        </Datagrid>
                        
                    </ReferenceManyField>
                </>
            )}

            <StockAdjustmentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                variant={variant} 
            />
        </Paper>
    );
};