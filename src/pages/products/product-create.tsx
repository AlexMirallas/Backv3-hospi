import { Stack, Box } from '@mui/material'; // Import Box
import { 
    Create,
    SimpleForm, 
    TextInput, 
    BooleanInput, 
    NumberInput, 
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    ReferenceInput,      // Import ReferenceInput
    AutocompleteInput,   // Import AutocompleteInput
    CreateProps,
    usePermissions,      // Import usePermissions
    useGetIdentity,      // Import useGetIdentity
    Loading,             // Import Loading
    required             // Import required
} from 'react-admin';
import { Typography } from '@mui/material';
import { useCallback } from 'react'; // Import useCallback

const ProductCreate:React.FC<CreateProps> = (props) => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();

    // Determine roles based on permissions
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;

    // Transform function to add clientId for admin users
    const transform = useCallback(async (data: any) => {
        const transformedData = { ...data };
        
        // If the current user is an admin (not superadmin), set the clientId automatically
        if (isAdmin && identity?.clientId) {
            transformedData.clientId = identity.clientId;
        } 
        // Ensure categoryIds is an array if selected
        if (transformedData.categoryIds && !Array.isArray(transformedData.categoryIds)) {
            transformedData.categoryIds = [transformedData.categoryIds];
        }

        console.log("Transformed Product Data:", transformedData);
        return transformedData;
    }, [isAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    // Determine if the user has permission to create products
    const canCreate = isSuperAdmin || isAdmin;

    if (!canCreate) {
        // Optional: Show a message or redirect if the user shouldn't be here
        return <Typography color="error">You do not have permission to create products.</Typography>;
    }
   
    return ( 
        <Create {...props} transform={transform}>
            <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            textAlign: 'center',
                            fontSize: '2rem'
                             }
                        }>
                            Créer un nouveau produit
            </Typography>
            <SimpleForm >
                {isSuperAdmin && (
                    <Box sx={{ width: '100%', mb: 2 }}> 
                        <ReferenceInput source="clientId" reference="clients" fullWidth>
                            <AutocompleteInput optionText="name" validate={required()} helperText="Assign product to a client"/>
                        </ReferenceInput>
                    </Box>
                )}

                <Stack direction="row" spacing={2} mb={2}>
                    <TextInput source="sku" validate={required()} helperText="Numéro d'unité de gestion des stocks, doit être unique"/>
                    <TextInput source="name" validate={required()} helperText="Nom de produit"/>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <NumberInput source="basePrice" validate={required()} helperText="Prix ​​de base du produit, le prix final sera calculé après ajustement du prix des variantes."/>
                    <BooleanInput source="isActive" defaultValue={true} helperText="Si non actif, il ne peut pas être vu par les clients"/>
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
        </Create>
     );
}
 
export default ProductCreate;