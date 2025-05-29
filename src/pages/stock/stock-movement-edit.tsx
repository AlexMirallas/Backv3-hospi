// Description: Edit page for stock movements in a React Admin application. Not Live component

import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    DateField,
    Labeled,
    SelectInput,
    Toolbar,
    SaveButton,
    DeleteButton,
    required,
    EditProps,
    useRecordContext,
} from 'react-admin';
import { Grid, Typography, Box } from '@mui/material';
import { StockMovementType } from '../../types/types';
import { StockMovementRecord } from '../../types/types';
import { documentTypesChoices } from '../../enums/enums'; 

const movementTypeChoices = Object.entries(StockMovementType).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
}));

const documentTypeChoices = documentTypesChoices;


const StockMovementEditToolbar = (props: any) => (
    <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SaveButton />
        <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
);



export const StockMovementEdit: React.FC<EditProps> = (props) => {

    const record = useRecordContext<StockMovementRecord>(); 

   
    const transform = (data: any) => {
        const { absoluteQuantity, movementType, ...restOfData } = data;
        let quantityChange = parseInt(absoluteQuantity, 10);

        if (isNaN(quantityChange)) {
            quantityChange = record?.quantityChange || 0;
        } else {
             if (
                movementType === StockMovementType.SALE ||
                movementType === StockMovementType.ADJUSTMENT_OUT
              
            ) {
                quantityChange = -Math.abs(quantityChange);
            } else {
                quantityChange = Math.abs(quantityChange);
            }
        }

        return {
            ...restOfData,
            quantityChange: quantityChange,
        };
    };

    const initialValues = record ? {
        ...record,
        absoluteQuantity: record.quantityChange ? Math.abs(record.quantityChange) : 0,
    } : {};

    return (
        <Edit  transform={transform}  {...props}>
            <SimpleForm toolbar={<StockMovementEditToolbar />} defaultValues={initialValues}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Modifier le mouvement des stocks
                </Typography>
                <Box sx={{ pt: 1 }}>
                    <Grid container spacing={3}>
                        {/* Column 1: Core Movement Details */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>Movement Details</Typography>
                            <TextInput source="id" fullWidth disabled label="Movement ID" sx={{ mb: 2 }} />
                            <Labeled>
                                <DateField source="movementDate" showTime label="Movement Date" sx={{ mb: 2 }} />
                            </Labeled> 
                            <SelectInput
                                source="movementType"
                                label="Movement Type"
                                choices={movementTypeChoices}
                                validate={required()}
                                sx={{ mb: 2 }}
                            />
                            <NumberInput
                                source="absoluteQuantity"
                                label="Changement de quantité"
                                helperText="Saisissez une valeur positive. Le type détermine +/-."
                                validate={required()}
                                sx={{ mb: 2 }}
                            />
                            <TextInput
                                source="reason"
                                label="Raison / Remarques (Optionnel)"
                                multiline
                                minRows={3}
                                fullWidth
                                resettable
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        {/* Column 2: Contextual Information & Source Document */}
                        <Grid item xs={12} md={6} mt={4} >

                            <SelectInput
                                source="sourceDocumentType"
                                choices={documentTypeChoices}
                                label="Type de document source"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextInput
                                source="sourceDocumentId"
                                label="ID/numéro du document source"
                                fullWidth
                                resettable
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </SimpleForm>
        </Edit>
    );
};

export default StockMovementEdit;