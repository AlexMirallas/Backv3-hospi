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
    FormDataConsumerRenderParams,
    usePermissions,
    Loading,

} from 'react-admin';
import { Box, Typography, Grid } from '@mui/material';
import { AttributeValueRecord, VariantAttributeValueLink } from '../../types/types'; 
import { transformEditVariant } from '../../utils/transformData';
import { VariantImageUploadForm } from '../../components/imageComponents/VariantImageUploadForm';
import { VariantImageList } from '../../components/imageComponents/VariantImageList';




export const VariantEdit = () => {
    const {isLoading:permissionsLoading, permissions} = usePermissions();
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    if(permissionsLoading) {
        return <Loading/>
    }

    return (
        <Edit transform={transformEditVariant} undoable={false}>
            <SimpleForm>   
                        <Grid container spacing={2}>
                             <Grid item xs={12} sm={6}>
                                <TextInput source="id" disabled fullWidth label="Variant ID" />
                             </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField source="product.name" label="Product"/>
                             </Grid>
                             {isSuperAdmin && (
                                <Grid item xs={12}> 
                                <ReferenceInput source="clientId" reference="clients" fullWidth>
                                    <AutocompleteInput optionText="name" validate={required()} helperText="Assign variant to a client"/>
                                </ReferenceInput>
                            </Grid>)
                            }
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
                                label={false}
                            >
                                <SimpleFormIterator
                                    inline
                                    disableRemove
                                    disableAdd
                                    disableReordering
                                    
                                >
                                    {/* Source targets the 'name' field within the 'attribute' object */}
                                    <TextField
                                        source="attribute.name"
                                        label="Attribute"
                                        sx={{ marginRight: 2, minWidth: 150, display: 'flex', alignItems: 'center' }}
                                    />

                                    {/* 2. Select Attribute Value */}
                                    <FormDataConsumer>
                                        {({ scopedFormData }: FormDataConsumerRenderParams<RaRecord, VariantAttributeValueLink>) => {
   
                                            const currentAttributeId = scopedFormData?.attribute?.id;
                                            const filter = currentAttributeId ? { attributeId: currentAttributeId } : {};

                                            return (
                                                <ReferenceInput
                                                    label={false}
                                                    source="attributeValue.id" 
                                                    reference="attribute-values" 
                                                    filter={filter} 
                                                    perPage={100}
                                                    isRequired
                                                    sx={{ minWidth: 200, marginRight: 2}}
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
                        <Box mt={3} width={'100%'}>
                            <Typography variant="subtitle1" gutterBottom>Variant Images</Typography>
                            <VariantImageList />
                            <Typography mt={3} variant="subtitle2" gutterBottom>Upload New Image</Typography>
                            <Box sx={{ width: '40%', mb: 2 }}>
                                <VariantImageUploadForm/> 
                            </Box>
                        </Box>                  
            </SimpleForm>
        </Edit>
    );
};