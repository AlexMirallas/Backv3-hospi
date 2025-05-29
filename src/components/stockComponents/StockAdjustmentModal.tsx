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
import { StockMovementType,StockAdjustmentModalProps } from '../../types/types';
import { documentTypesChoices } from '../../enums/enums';


const movementTypeChoices = Object.entries(StockMovementType).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
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
    const documentTypeChoices = documentTypesChoices;


    const handleSave = (values: any) => {
        if (!recordContext || !identity) {
            notify('Required context or user identity is missing.', { type: 'error' });
            return;
        }

        if (!recordContext.clientId) {
            notify(`Client ID is missing on the ${isProductAdjustment ? 'product' : 'variant'}. Cannot record stock movement.`, { type: 'error' });
            return;
        }

        let quantity = parseInt(values.quantity, 10);
        if (isNaN(quantity)) {
            notify('Invalid quantity.', { type: 'error' });
            return;
        }

        const movementType = values.movementType as StockMovementType;
        let quantityChange = quantity;

        if (
            movementType === StockMovementType.SALE ||
            movementType === StockMovementType.ADJUSTMENT_OUT
        ) {
            quantityChange = -Math.abs(quantity);
        } else {
            quantityChange = Math.abs(quantity);
        }

        create(
            'adjust-stock',
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
                    sourceDocumentId: values.sourceDocumentId, 
                    sourceDocumentType: values.sourceDocumentType, 
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
                toolbar={false} 
                mode="onBlur"
            >
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <SelectInput
                                source="movementType"
                                label="Typoe de Mouvement"
                                choices={movementTypeChoices}
                                validate={required()}
                                fullWidth
                                isRequired
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <NumberInput
                                source="quantity"
                                label="Quantité"
                                helperText="Saisissez une valeur positive. Le type détermine +/-.."
                                validate={[required(), minValue(1)]} 
                                fullWidth
                                isRequired
                            />
                        </Grid>
                    
                        <Grid item xs={12} sm={6}>
                            <SelectInput source="sourceDocumentType" choices={documentTypeChoices} label="Type de document (par exemple, bon de commande, facture)" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextInput source="sourceDocumentId" label="ID/numéro du document source" fullWidth />
                        </Grid>

                        <Grid item xs={12}>
                            <TextInput
                                source="reason"
                                label="Raison / Remarques (Optionnel)"
                                multiline
                                minRows={2}
                                fullWidth
                            />
                        </Grid>
                        
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