import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    NumberInput,
    AutocompleteArrayInput,
    EditProps,
    usePermissions,
    Loading,
    ReferenceInput,
    AutocompleteInput,
    required,
} from 'react-admin';
import { ExistingVariantsList } from '../product-variants/product-variant-list';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography,Stack,Box } from '@mui/material';





export const ProductEdit:React.FC<EditProps> = (props) => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();

    // Determine roles based on permissions
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    // No specific check needed for isAdmin unless they have different edit capabilities

    // Transform function (optional, e.g., ensure categoryIds is array)
    const transform = async (data: any) => {
        const transformedData = { ...data };
        // Ensure categoryIds is an array if selected
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
            <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            textAlign: 'center',
                            fontSize: '2rem'
                             }
                        }>
                            Modifier le produit
            </Typography>
            <SimpleForm >
                <TextInput source="id" disabled fullWidth />

                {/* Client ID Field - Editable for SuperAdmin, Read-only otherwise */}
                {isSuperAdmin ? (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <ReferenceInput source="clientId" reference="clients" fullWidth>
                            <AutocompleteInput optionText="name" validate={required()} helperText="Assign product to a client"/>
                        </ReferenceInput>
                    </Box>
                ) : (
                    // Non-SuperAdmins see client ID as read-only
                    // You could use ReferenceField here too if you want to show the client name
                    <TextInput source="clientId" disabled fullWidth helperText="Client ID (read-only)" />
                )}

                <Stack direction="row" spacing={2} mb={2}>
                    <TextInput source="sku" validate={required()} helperText="Numéro d'unité de gestion des stocks, doit être unique"/>
                    <TextInput source="name" validate={required()} helperText="Nom de produit"/>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <NumberInput source="basePrice" validate={required()} helperText="Prix ​​de base du produit, le prix final sera calculé après ajustement du prix des variantes."/>
                    <BooleanInput source="isActive" helperText="Si non actif, il ne peut pas être vu par les clients"/>
                </Stack>
                <TextInput source="description" validate={required()} multiline rows={3} fullWidth />
                <ReferenceArrayInput source="categoryIds" reference="categories" fullWidth>
                    <AutocompleteArrayInput
                        optionText="name"
                        optionValue="id"
                        label="Categories" 
                        helperText="Select one or more categories"
                    />
                </ReferenceArrayInput>
            </SimpleForm>
            <ExistingVariantsList  />
            <Card sx={{ marginTop: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Add New Variant</Typography>
                    <AddNewVariantForm />
                </CardContent>
            </Card>   
        </Edit>
    </>
)};

