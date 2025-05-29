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
                <FormTab label="Détails du produit">
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
                        <TextInput source="sku" label="SKU" validate={required()} />
                        <TextInput source="name" label="Nom du produit" validate={required()} />
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                        <NumberInput source="basePrice" label="Prix de base" validate={required()}  />
                        <BooleanInput source="isActive" label="Est actif" helperText="Désactiver si le produit est arrêté" />
                        <BooleanInput source="trackInventory" label="Suivre l'inventaire" helperText="Si vous souhaitez suivre l'inventaire des produits" />
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
                                    <AutocompleteArrayInput  label ="Catégories"  helperText="Sélectionnez les catégories auxquelles ce produit appartient"/>
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
                                <Typography>Ajouter une nouvelle image</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ProductImageUploadForm />
                        </AccordionDetails>
                    </Accordion>
                </FormTab>

                <FormTab label="Variantes de produits" path="variants">
                    <ExistingVariantsList />
                    <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-add-variant-content"
                                id="panel-add-variant-header"
                            >
                                 <Stack direction="row" spacing={1} alignItems="center">
                                    <AddCircleOutlineIcon color="primary"/>
                                    <Typography>Ajouter une variante</Typography>
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

                <FormTab label="Gestion des stocks" path="stock">
                    <FormDataConsumer>
                        {({ formData }) => { // 
                            if (!formData) return <Loading />;
                            if (!formData.trackInventory) {
                                return (
                                    <Typography sx={{ p: 2 }}>
                                        Le suivi des stocks est désactivé pour ce produit. Activez-le dans l'onglet « Détails du produit » pour gérer les stocks.
                                    </Typography>
                                );
                            }

                            const hasVariants = formData.variants && formData.variants.length > 0;
                            

                            if (hasVariants) {
                                return (
                                    <Box sx={{ p: 1, width: '100%' }}>
                                        <Typography variant="body1" sx={{mb:2}}>
                                            Ce produit suit les stocks et possède des variantes. Gérez le stock de chaque variante individuellement.
                                        </Typography>
                                        {formData.variants.map((variant: ProductVariantRecord) => (
                                            <VariantStockManager
                                            key={variant.id}
                                            variant={variant}
                                            productTrackInventory={formData.trackInventory}/>
                                        ))}
                                    </Box>
                                );
                            } else {
                                // If product tracks inventory AND has NO variants, manage stock at product level
                                return <ProductStockManager />;
                            }
                        }}
                    </FormDataConsumer>
                </FormTab>
            </TabbedForm>
        </Edit>
    </>
)};

