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
import { Card, CardContent, Typography,Stack,Box, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import { ProductImageList } from '../../components/imageComponents/ProductimageList';
import { ProductImageUploadForm } from '../../components/imageComponents/ProductImageUploadForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
            <TabbedForm>
                <FormTab label="Product Details">
                    <Typography variant="h5">
                        Modifier le produit
                    </Typography>
                    <TextInput source="id" disabled fullWidth />

                    {isSuperAdmin ? (
                         <Box sx={{ width: '100%', mb: 2 }}>
                            <ReferenceInput source="clientId" reference="clients" fullWidth>
                                <AutocompleteInput optionText="name" validate={required()} helperText="Assign product to a client"/>
                            </ReferenceInput>
                        </Box>
                    ) : (
                        <TextInput source="clientId" disabled fullWidth helperText="Client ID (read-only)" />
                    )}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextInput source="sku" validate={required()} />
                        <TextInput source="name" validate={required()} />
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                        <NumberInput source="basePrice" validate={required()} />
                        <BooleanInput source="isActive" />
                    </Stack>
                    <TextInput source="description" validate={required()} multiline rows={3} fullWidth />

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
                                    <AutocompleteArrayInput />
                                </ReferenceArrayInput>
                            );
                        }}
                    </FormDataConsumer>
                </FormTab>

                <FormTab label="Images" path="images">
                    <ProductImageList />
                    <Accordion sx={{ mt: 2, width: '40%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel-upload-image-content"
                            id="panel-upload-image-header"
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AddCircleOutlineIcon color="primary"/>
                                <Typography>Add New Image</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ProductImageUploadForm />
                        </AccordionDetails>
                    </Accordion>
                </FormTab>

                 <FormTab label="Variants" path="variants">
                    <ExistingVariantsList />
                    <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-add-variant-content"
                                id="panel-add-variant-header"
                            >
                                 <Stack direction="row" spacing={1} alignItems="center">
                                    <AddCircleOutlineIcon color="primary"/>
                                    <Typography>Add New Variant</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card>
                                    <CardContent>
                                        <AddNewVariantForm />
                                    </CardContent>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                 </FormTab>
            </TabbedForm>
        </Edit>
    </>
)};

