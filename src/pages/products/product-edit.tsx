import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    TabbedForm,
    FormTab,
    TextInput,
    NumberInput,
    AutocompleteArrayInput,
    EditProps,
    usePermissions,
    Loading,
    ReferenceInput,
    AutocompleteInput,
    required,
    FormDataConsumer,
} from 'react-admin';
import { ExistingVariantsList } from '../product-variants/product-variant-list';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography,Stack,Box } from '@mui/material';
import { ProductImageList } from '../../components/imageComponents/ProductimageList';
import { ProductImageUploadForm } from '../../components/imageComponents/ProductImageUploadForm';





export const ProductEdit:React.FC<EditProps> = (props) => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

 
    const transform = async (data: any) => {
        const transformedData = { ...data };
        if (transformedData.categoryIds && !Array.isArray(transformedData.categoryIds)) {
            transformedData.categoryIds = [transformedData.categoryIds];
        }
        return transformedData;
    };

    if (permissionsLoading) {
        return <Loading />;
    }
    return (
        <> 
        <Edit {...props} transform={transform}>
            {/* Use TabbedForm instead of SimpleForm for better organization */}
            <TabbedForm>
                <FormTab label="Product Details">
                    {/* Keep all your existing product fields here */}
                    <Typography variant="h5" /* ... styles ... */>
                        Modifier le produit
                    </Typography>
                    <TextInput source="id" disabled fullWidth />

                    {/* Client Selection/Display */}
                    {isSuperAdmin ? (
                         <Box sx={{ width: '100%', mb: 2 }}>
                            <ReferenceInput source="clientId" reference="clients" fullWidth>
                                <AutocompleteInput optionText="name" validate={required()} helperText="Assign product to a client"/>
                            </ReferenceInput>
                        </Box>
                    ) : (
                        <TextInput source="clientId" disabled fullWidth helperText="Client ID (read-only)" />
                    )}
{/* SKU, Name, Price, Active, Description */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextInput source="sku" validate={required()} /* ... */ />
                        <TextInput source="name" validate={required()} /* ... */ />
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                        <NumberInput source="basePrice" validate={required()} /* ... */ />
                        <BooleanInput source="isActive" /* ... */ />
                    </Stack>
                    <TextInput source="description" validate={required()} multiline rows={3} fullWidth />

                    {/* Category Selection */}
                    <FormDataConsumer>
                        {({ formData, ...rest }) => {
                            let categoryFilter = {};
                            if (formData.clientId) {
                                categoryFilter = { clientId: formData.clientId };
                            }
                            return (
                                <ReferenceArrayInput
                                    source="categoryIds"
                                    reference="categories"
                                    filter={categoryFilter}
                                    fullWidth
{...rest}
                                >
                                    <AutocompleteArrayInput /* ... */ />
                                </ReferenceArrayInput>
                            );
                        }}
                    </FormDataConsumer>
                </FormTab>

                <FormTab label="Images" path="images">
                    {/* Display existing images and upload form */}
                    {/* These components operate outside the main form's save */}
                    <ProductImageList />
                    <ProductImageUploadForm />
                </FormTab>

                 <FormTab label="Variants" path="variants">
                    {/* Keep ExistingVariantsList and AddNewVariantForm sections */}
                    {/* Note: AddNewVariantForm might need its own image upload logic */}
                    <ExistingVariantsList />
<Card sx={{ marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Add New Variant</Typography>
                            <AddNewVariantForm />
                        </CardContent>
                    </Card>
                 </FormTab>
            </TabbedForm>
        </Edit>
    </>
)};

