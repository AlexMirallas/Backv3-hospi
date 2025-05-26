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
    Labeled,
    NumberField,
} from 'react-admin';
import { ExistingVariantsList } from '../product-variants/product-variant-list';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography,Stack,Box, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import { ProductImageList } from '../../components/imageComponents/ProductimageList';
import { ProductImageUploadForm } from '../../components/imageComponents/ProductImageUploadForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ProductStockManager } from '../../components/stockComponents/ProductStockManager';
import { VariantStockManager } from '../../components/stockComponents/VariantStockManager';
import { ProductRecord,ProductVariantRecord } from '../../types/types';

export const ProductEdit:React.FC<EditProps> = (props) => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    const transform = async (data: ProductRecord) => {
        const transformedData: any = { ...data };
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
                        <BooleanInput source="isActive" helperText="désactiver si le produit est arrêté" />
                        <BooleanInput source="trackInventory" label="Suivre l'inventaire" helperText="Si vous souhaitez suivre l'inventaire des produits." />
                    </Stack>
                    <Stack>
                        <Labeled label="Stock actuel" sx={{ width: '100%',mb: 2, fontSize: '1.2rem' }}>
                            <NumberField source="currentStock"  />
                        </Labeled>
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

                <FormTab label="Stock Management" path="stock">
                    <FormDataConsumer>
                        {({ formData }) => { // 'formData' here is the ProductRecord
                            if (!formData) return <Loading />;

                            if (!formData.trackInventory) {
                                return (
                                    <Typography sx={{ p: 2 }}>
                                        Inventory tracking is disabled for this product.
                                        Enable it in the "Product Details" tab to manage stock.
                                    </Typography>
                                );
                            }

                            const hasVariants = formData.variants && formData.variants.length > 0;
                            console.log('hasVariants:', hasVariants);

                            if (hasVariants) {
                                // If product tracks inventory AND has variants, manage stock per variant
                                return (
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="body1" sx={{mb:1}}>
                                            This product tracks inventory and has variants. Manage stock for each variant individually.
                                        </Typography>
                                        {formData.variants.map((variant: ProductVariantRecord) => (
                            <VariantStockManager
                                key={variant.id}
                                variant={variant}
                                productTrackInventory={formData.trackInventory}
                            />
                                        ))}
                                    </Box>
                                );
                            } else {
                                // If product tracks inventory AND has NO variants, manage stock at product level
                                // ProductLevelStockManager uses useRecordContext, so it gets the product record
                                return <ProductStockManager />;
                            }
                        }}
                    </FormDataConsumer>
                </FormTab>
            </TabbedForm>
        </Edit>
    </>
)};

