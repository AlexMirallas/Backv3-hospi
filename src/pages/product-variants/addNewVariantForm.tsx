import React, { useState, useCallback, useEffect } from 'react';
import {
    useDataProvider,
    useNotify,
    useRefresh,
    useRecordContext,
    useGetList,
    ReferenceInput, // Still useful for fetching/displaying options
    AutocompleteInput, // Still useful for selecting options
    RaRecord,
    Identifier,
} from 'react-admin';
import {
    Box,
    Grid,
    CircularProgress,
    Alert,
    TextField, 
    FormControlLabel, 
    Switch, 
    Button, 
} from '@mui/material';



// Type for Attribute records
interface AttributeRecord extends RaRecord {
    id: Identifier;
    name: string;
}

// Type for AttributeValue records
interface AttributeValueRecord extends RaRecord {
    id: Identifier;
    value: string;
    attribute?: {
        id: Identifier;
        name: string;
    };
}

// Define state structure for the variant form
interface NewVariantState {
    sku: string;
    priceAdjustment: number | string; // Use string initially for TextField
    stockQuantity: number | string;   // Use string initially for TextField
    isActive: boolean;
    // Store selected attribute values, e.g., { attributeId: attributeValueId }
    selectedAttributeValues: Record<Identifier, Identifier | null>;
}

const initialVariantState: NewVariantState = {
    sku: '',
    priceAdjustment: 0,
    stockQuantity: 0,
    isActive: true,
    selectedAttributeValues: {},
};

export const AddNewVariantForm: React.FC = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const productRecord = useRecordContext(); // Get the current product being edited

    // State for the form inputs
    const [variantData, setVariantData] = useState<NewVariantState>(initialVariantState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all relevant Attributes
    const { data: attributes, isLoading: attributesLoading, error: attributesError } = useGetList<AttributeRecord>(
        'attributes',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' }
        }
    );

    // Initialize selectedAttributeValues state when attributes load
    useEffect(() => {
        if (attributes) {
            const initialSelections: Record<Identifier, Identifier | null> = {};
            attributes.forEach(attr => {
                initialSelections[attr.id] = null; // Initialize all selections to null
            });
            setVariantData(prev => ({ ...prev, selectedAttributeValues: initialSelections }));
        }
    }, [attributes]);


    // Handle input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type,  } = event.target;
        setVariantData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'switch' ? "checked" : value,
        }));
    };

    // Handle attribute value selection changes (specifically for Autocomplete/Select)
    const handleAttributeValueChange = (attributeId: Identifier, value: Identifier | null) => {
         setVariantData(prev => ({
             ...prev,
             selectedAttributeValues: {
                 ...prev.selectedAttributeValues,
                 [attributeId]: value
             }
         }));
    };

    // Handle form submission
    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        if (!productRecord || !productRecord.id || !attributes) {
            notify('Product context or attributes not available.', { type: 'error' });
            return;
        }
        setIsSubmitting(true);

        // --- Validation ---
        if (!variantData.sku) {
            notify('SKU is required.', { type: 'warning' });
            setIsSubmitting(false);
            return;
        }
        const attributeValueSelections = Object.entries(variantData.selectedAttributeValues)
            .filter(([_, valueId]) => valueId !== null) // Filter out unset values
            .map(([_, valueId]) => ({ attributeValueId: valueId as Identifier })); // Map to expected DTO structure


        if (attributeValueSelections.length !== attributes.length) {
             notify(`Please select a value for all attributes (${attributes.map(a => a.name).join(', ')}).`, { type: 'warning' });
             setIsSubmitting(false);
             return;
        }
        // --- End Validation ---


        const newVariantPayload = {
            sku: variantData.sku,
            // Convert price/stock back to numbers, handle potential NaN
            priceAdjustment: Number(variantData.priceAdjustment) || 0,
            stockQuantity: Number(variantData.stockQuantity) || 0,
            isActive: variantData.isActive,
            productId: productRecord.id,
            attributeValues: attributeValueSelections, // Use the validated & formatted array
        };

        try {
            await dataProvider.create('variants', { data: newVariantPayload });
            notify('Variant created successfully!', { type: 'success' });
            refresh(); // Refresh ProductEdit view
            setVariantData(initialVariantState); // Reset form state
        } catch (error: any) {
            console.error("Error creating variant:", error);
            notify(error.message || 'Error creating variant.', { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    }, [dataProvider, notify, refresh, productRecord, attributes, variantData]);


    if (attributesLoading) return <CircularProgress />;
    if (attributesError) return <Alert severity="error">Error loading attributes: {attributesError.message}</Alert>;
    if (!attributes) return <Alert severity="info">No attributes found.</Alert>;
    if (!productRecord) return <Alert severity="warning">Product context not found.</Alert>;

    return (
        // Use a standard form tag, NO SimpleForm
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {/* Basic Variant Fields using MUI components */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        name="sku"
                        label="Variant SKU"
                        value={variantData.sku}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                 <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        name="priceAdjustment"
                        label="Price Adj."
                        type="number" // Use type="number"
                        value={variantData.priceAdjustment}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                     {/* Or use MUI Base NumberInput if installed and preferred */}
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        name="stockQuantity"
                        label="Stock Qty."
                        type="number"
                        value={variantData.stockQuantity}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                name="isActive"
                                checked={variantData.isActive}
                                onChange={handleChange}
                            />
                        }
                        label="Is Active"
                    />
                </Grid>

                {/* Dynamically Generated Attribute Selectors */}
                {attributes.map(attribute => (
                    <Grid item xs={12} sm={6} md={4} key={attribute.id}>
                         {/* Still use ReferenceInput for data fetching + Autocomplete for UI */}
                         {/* The 'source' prop here is only for ReferenceInput's internal use, not form state */}
                         <ReferenceInput
                            label={attribute.name}
                            source={`${attribute.name}`} // Dummy source, not used for state
                            reference="attribute-values" // Corrected reference
                            filter={{ attributeId: attribute.id }}
                            perPage={100}
                            allowEmpty={false} // Make selection mandatory via form logic instead
                            isRequired // Visually indicate requirement if needed
                         >
                             {/* Autocomplete still manages its own selection state internally */}
                             {/* We capture its value via onChange */}
                             <AutocompleteInput<AttributeValueRecord>
                                 optionText={(record?: AttributeValueRecord) => record?.value ?? ''}
                                 // Provide the current value from our *manual* state
                                 // Note: AutocompleteInput might not directly accept 'value' prop.
                                 // We need to control the *selection* it represents.
                                 // This might require using Autocomplete component directly from MUI
                                 // instead of RA's AutocompleteInput for full manual control.

                                 // *** Alternative/Simpler: Use onChange to update manual state ***
                                 onChange={(value) => handleAttributeValueChange(attribute.id, value)}
                                 // We don't set `validate={required}` here, we do it in handleSubmit
                                 fullWidth
                                 size="small"
                                 helperText={false} // Remove RA helper text
                                 // Manually pass the selected value IF AutocompleteInput supports it, otherwise rely on onChange
                                 // value={variantData.selectedAttributeValues[attribute.id] ?? ''} // This might not work as expected with RA's input wrapper
                             />
                             {/* --- OR Use MUI Select ---
                             <Select
                                 labelId={`${attribute.id}-label`}
                                 value={variantData.selectedAttributeValues[attribute.id] ?? ''}
                                 label={attribute.name} // Need InputLabel wrapper for this
                                 onChange={(e) => handleAttributeValueChange(attribute.id, e.target.value as Identifier)}
                                 fullWidth
                                 size="small"
                             >
                                // Need to fetch options separately or use ReferenceInput's render prop
                                <MenuItem value=""><em>None</em></MenuItem>
                                // Map over fetched values here...
                             </Select>
                            */}
                         </ReferenceInput>
                    </Grid>
                ))}

                {/* Submission Button */}
                <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || attributesLoading}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Create Variant'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};