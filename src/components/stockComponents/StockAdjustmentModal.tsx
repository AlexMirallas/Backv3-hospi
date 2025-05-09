import React from 'react';
import {
    useCreate,
    useNotify,
    useRefresh,
    SimpleForm,
    NumberInput,
    SelectInput,
    TextInput,
    required,
    minValue,
    useGetIdentity,
    Loading,
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from '@mui/material';
import { ProductRecord, ProductVariantRecord, StockMovementType } from '../../types/types';

interface StockAdjustmentModalProps {
    open: boolean;
    onClose: () => void;
    product?: ProductRecord;
    variant?: ProductVariantRecord;
    currentStock?: number; // Pass current stock for display
}

const movementTypeChoices = Object.entries(StockMovementType).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format name nicely
}));

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
    open,
    onClose,
    product,
    variant,
    currentStock,
}) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [create, { isLoading: isSaving }] = useCreate();
    const { identity, isLoading: identityLoading } = useGetIdentity();

    const recordContext = product || variant;
    const recordName = product ? product.name : variant?.sku;
    const isProductAdjustment = !!product;

    const handleSave = (values: any) => {
        if (!recordContext || !identity) {
            notify('Required context or user identity is missing.', { type: 'error' });
            return;
        }

        let quantity = parseInt(values.quantity, 10);
        if (isNaN(quantity)) {
            notify('Invalid quantity.', { type: 'error' });
            return;
        }

        const movementType = values.movementType as StockMovementType;
        let quantityChange = quantity;

        // Adjust sign based on movement type convention
        if (
            movementType === StockMovementType.SALE ||
            movementType === StockMovementType.ADJUSTMENT_OUT
        ) {
            quantityChange = -Math.abs(quantity);
        } else {
            quantityChange = Math.abs(quantity);
        }

        create(
            'stock-movements',
            {
                data: {
                    productId: isProductAdjustment ? recordContext.id : undefined,
                    variantId: !isProductAdjustment ? recordContext.id : undefined,
                    clientId: recordContext.clientId,
                    userId: identity.id,
                    movementType: movementType,
                    quantityChange: quantityChange,
                    reason: values.reason,
                    movementDate: new Date(),
                    // sourceDocumentId: values.sourceDocumentId, // For future document tracking
                    // sourceDocumentType: values.sourceDocumentType, // For future document tracking
                },
            },
            {
                onSuccess: () => {
                    notify('Stock movement recorded successfully.', { type: 'info' });
                    refresh();
                    onClose();
                },
                onError: (error: any) => {
                    notify(`Error: ${error.message || 'Could not record stock movement.'}`, { type: 'error' });
                },
            }
        );
    };

    if (identityLoading) {
        return <Dialog open={open} onClose={onClose}><DialogContent><Loading /></DialogContent></Dialog>;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Adjust Stock for: {recordName}
                {currentStock !== undefined && <Typography variant="caption" display="block">Current Stock: {currentStock}</Typography>}
            </DialogTitle>
            <SimpleForm
                onSubmit={handleSave}
                toolbar={false} // We'll use DialogActions
                mode="onBlur"
            >
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <SelectInput
                                source="movementType"
                                label="Movement Type"
                                choices={movementTypeChoices}
                                validate={required()}
                                fullWidth
                                isRequired
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <NumberInput
                                source="quantity"
                                label="Quantity"
                                helperText="Enter a positive value. Type determines +/-."
                                validate={[required(), minValue(1)]} // Quantity should be at least 1
                                fullWidth
                                isRequired
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextInput
                                source="reason"
                                label="Reason / Notes (Optional)"
                                multiline
                                minRows={2}
                                fullWidth
                            />
                        </Grid>
                        {/* Placeholder for future document upload fields
                        <Grid item xs={12} sm={6}>
                            <TextInput source="sourceDocumentType" label="Document Type (e.g., PO, Invoice)" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput source="sourceDocumentId" label="Document ID/Number" fullWidth />
                        </Grid>
                        */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Record Movement'}
                    </Button>
                </DialogActions>
            </SimpleForm>
        </Dialog>
    );
};