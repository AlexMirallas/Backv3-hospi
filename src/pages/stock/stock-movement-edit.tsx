import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    DateField,
    ReferenceField,
    TextField,
    SelectInput,
    Toolbar,
    SaveButton,
    DeleteButton,
    required,
    useRecordContext,
    EditProps,
} from 'react-admin';
import { Grid, Typography, Box } from '@mui/material';

// Define choices for movementType if you have them
const movementTypeChoices = [
    { id: 'manual_adjustment_in', name: 'Manual Adjustment (In)' },
    { id: 'manual_adjustment_out', name: 'Manual Adjustment (Out)' },
    { id: 'sale', name: 'Sale' },
    { id: 'return', name: 'Return' },
    { id: 'initial_stock', name: 'Initial Stock' },
    // Add other types as needed
];

const StockMovementEditToolbar = (props: any) => (
    <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SaveButton />
        <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
);


export const StockMovementEdit: React.FC<EditProps> = (props) => (
    <Edit  {...props}>
        <SimpleForm toolbar={<StockMovementEditToolbar />}>
            <Typography variant="h6" gutterBottom>
                Edit Stock Movement Details
            </Typography>
            <Box sx={{ paddingTop: '1em' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Movement Information</Typography>
                        <DateField source="movementDate" showTime label="Movement Date"   />
                        <SelectInput
                            source="movementType"
                            choices={movementTypeChoices}
                            validate={required()}
                            fullWidth
                        />
                        <NumberInput source="quantityChange" validate={required()} fullWidth />
                        <TextInput source="reason" multiline fullWidth resettable />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Associated Entities</Typography>
                        {/* Display Product or Variant if applicable */}
                        {/* You might need conditional logic here based on whether it's a product or variant movement */}
                        <ReferenceField label="Product" source="productId" reference="products" link="show" >
                            <TextField source="name" />
                        </ReferenceField>
                        <ReferenceField label="Variant" source="variantId" reference="variants" link="show" >
                            <TextField source="sku" />
                        </ReferenceField>
                         <TextField source="id" label="Movement ID" fullWidth  />
                    </Grid>
                </Grid>
            </Box>
        </SimpleForm>
    </Edit>
);

export default StockMovementEdit;