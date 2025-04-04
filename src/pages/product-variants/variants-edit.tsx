import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    BooleanInput,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    AutocompleteInput,
    TextField,      
    FormDataConsumer,
    RaRecord,
    required,
    FormDataConsumerRenderParams
} from 'react-admin';
import { Box, Typography, Grid } from '@mui/material';
import { AttributeValueRecord, VariantAttributeValueLink } from '../../types/types'; 
import { transformEditVariant } from '../../utils/transformData';



export const VariantEdit = () => {
    return (
        <Edit transform={transformEditVariant} mutationMode="optimistic" undoable={false}>
            <SimpleForm>   
                        <Grid container spacing={2}>
                             <Grid item xs={12} sm={6}>
                                <TextInput source="id" disabled fullWidth label="Variant ID" />
                             </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField source="product.name" label="Product"/>
                             </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextInput source="sku" validate={required()} fullWidth />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <NumberInput source="priceAdjustment" label="Price Adj." fullWidth defaultValue={0} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <NumberInput source="stockQuantity" label="Stock Qty." fullWidth defaultValue={0} />
                             </Grid>
                             <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <BooleanInput source="isActive" label="Is Active" defaultValue={true} />
                            </Grid>
                        </Grid>


                        <Box mt={3}>
                            <Typography variant="subtitle1" gutterBottom>Attributes</Typography>
                            <ArrayInput
                                source="attributeValues"
                            >
                                <SimpleFormIterator
                                    inline
                                    disableAdd
                                    disableRemove
                                    disableReordering
                                >
                                    {/* Source targets the 'name' field within the 'attribute' object */}
                                    <TextField
                                        source="attribute.name"
                                        sx={{ marginRight: 2, minWidth: 150, display: 'flex', alignItems: 'center' }} 
                                    />

                                    {/* 2. Select Attribute Value */}
                                    <FormDataConsumer>
                                        {/* Adjust type for scopedFormData */}
                                        {({ scopedFormData }: FormDataConsumerRenderParams<RaRecord, VariantAttributeValueLink>) => {

                                            // Get the parent attribute ID from the NESTED structure
                                            const currentAttributeId = scopedFormData?.attribute?.id; // <-- Use attribute.id
                                            const filter = currentAttributeId ? { attributeId: currentAttributeId } : {};

                                            if (!currentAttributeId) {
                                                return <Typography color="error" sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>Missing Attribute ID</Typography>;
                                            }

                                            return (
                                                <ReferenceInput
                                                    label="Value"
                                                    source="attributeValue.id" 
                                                    reference="attribute-values" // Resource to fetch options like 'M', 'L', 'Red', 'Green'
                                                    filter={filter} // Filter options by parent attribute ID
                                                    perPage={100}
                                                    isRequired
                                                    sx={{ minWidth: 200 }}
                                                >
                                                    <AutocompleteInput
                                                        optionText={(record?: AttributeValueRecord) => record?.value ?? ''}
                                                        fullWidth
                                                        size="small"
                                                        helperText={false}
                                                    />
                                                </ReferenceInput>
                                            );
                                        }}
                                    </FormDataConsumer>
                                </SimpleFormIterator>
                            </ArrayInput>
                        </Box>
            </SimpleForm>
        </Edit>
    );
};