import React, { useCallback } from 'react';
import {
    useDataProvider,
    useNotify,
    useRefresh,
    useRecordContext,
    useGetList,
    ReferenceInput, 
    AutocompleteInput, 
    NumberInput,
    BooleanInput,
    Form,
    TextInput,
    required,
    SaveButton
} from 'react-admin';
import {
    Box,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import { AttributeRecord } from '../../types/types';
import { AttributeValueRecord } from '../../types/types';





export const AddNewVariantForm: React.FC = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const productRecord = useRecordContext();

    // Fetch attributes 
    const { data: attributes, isLoading: attributesLoading, error: attributesError } = useGetList<AttributeRecord>(
        'attributes',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' }
        }
       
    );

    // --- Custom Submit Handler for <Form> ---
    const handleSubmit = useCallback(async (formData: any) => {
        if (!productRecord || !productRecord.id || !attributes) {
            notify('Product context or attributes not available.', { type: 'error' });
            return;
        }
        
        //Debugging Form Data and Attributes
        console.log("--- Form Data ---");
        console.log(formData);
        console.log("--- Attributes ---");
        console.log(attributes);


        // Extract attribute values from formData based on dynamic sources
        const attributeValueSelections = attributes
            .map(attr => {
                // Get the selected value ID from the form data
                const selectedValueId = formData[`${attr.name}`];

                // Only create an object if a value was actually selected for this attribute
                if (selectedValueId != null) { // Check for null or undefined
                    return {
                        attributeValueId: selectedValueId, // The ID of the selected value (e.g., 4 for 'Red')
                        attributeId: attr.id              // The ID of the parent attribute (e.g., the ID for 'Color')
                    };
                }
                return null; // Return null if no value was selected for this attribute
            })
            .filter(item => item !== null); // Filter out the null entries where no value was selected


        // --- Validation (can also use RA validation props on inputs) ---
        if (!formData.sku) {
            notify('SKU is required.', { type: 'warning' });
            return; 
        }
        if (attributeValueSelections.length !== attributes.length) {
            console.log("Attribute Value Selections:", attributeValueSelections);
             notify(`Please select a value for all attributes (${attributes.map(a => a.name).join(', ')}).`, { type: 'warning' });
             return;
        }
        // --- End Validation ---


        const newVariantPayload = {
            sku: formData.sku,
            priceAdjustment: Number(formData.priceAdjustment) || 0,
            stockQuantity: Number(formData.stockQuantity) || 0,
            isActive: formData.isActive ?? true, // Default to true if not provided
            productId: productRecord.id,
            attributeValues: attributeValueSelections,
        };

        try {
            // Using dataProvider.create
            await dataProvider.create('variants', { data: newVariantPayload });
            notify('Variant created successfully!', { type: 'success' });
            refresh(); // Refresh ProductEdit view
            
        } catch (error: any) {
            console.error("Error creating variant:", error);
            notify(error.message || 'Error creating variant.', { type: 'error' });

        }
    }, [dataProvider, notify, refresh, productRecord, attributes]);


    if (attributesLoading) return <CircularProgress size={24} />;
    if (attributesError) return <Alert severity="error">Error loading attributes: {attributesError.message}</Alert>;
    if (!attributes) return <Alert severity="info">No attributes found.</Alert>;
    if (!productRecord) return <Alert severity="warning">Product context not found.</Alert>;

    return (
        <Form onSubmit={handleSubmit}>
            <Box sx={{ mt: 2, width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextInput source="sku" label="Variant SKU" validate={required()} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <NumberInput source="priceAdjustment" label="Price Adj." fullWidth size="small" defaultValue={0} />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <NumberInput source="stockQuantity" label="Stock Qty." fullWidth size="small" defaultValue={0} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        <BooleanInput source="isActive" label="Is Active" defaultValue={true} />
                    </Grid>
                   
                    {/* Dynamically Generated Attribute Selectors */}
                    {attributes.map(attribute => (
                        <Grid item xs={12} sm={6} md={4} key={attribute.id}>
                             <ReferenceInput
                                label={attribute.name}
                                source={`${attribute.name}`}
                                reference="attribute-values"
                                filter={{ attributeId: attribute.id }}
                                perPage={100}
                                allowEmpty={false} // 
                                isRequired 
                             >
                                 <AutocompleteInput
                                     optionText={(record?: AttributeValueRecord) => record?.value ?? ''}
                                     fullWidth
                                     size="small"
                                     helperText={false}
                                 />
                             </ReferenceInput>
                        </Grid>
                    ))}

                    {/* Submission Button */}
                    <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>   
                          <SaveButton /> 
                    </Grid>
                </Grid>
            </Box>
        </Form>
    );
};