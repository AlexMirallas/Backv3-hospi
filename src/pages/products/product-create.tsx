import { Stack, Box } from '@mui/material'; 
import { 
    Create,
    SimpleForm, 
    TextInput, 
    BooleanInput, 
    NumberInput, 
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    ReferenceInput,      
    AutocompleteInput,   
    CreateProps,
    usePermissions,     
    useGetIdentity,     
    Loading,           
    required,
    useNotify,
    useRedirect,
    FormDataConsumer, 
} from 'react-admin';
import { Typography, Grid } from '@mui/material';
import { useCallback } from 'react'; 

const ProductCreate:React.FC<CreateProps> = (props) => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();
    const notify = useNotify();
    const redirect = useRedirect();

   
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;

    const validateStock = (value: any, allValues: any) => {
        if (allValues.trackInventory && (value === undefined || value === null)) {
            // If tracking inventory, initial stock is technically optional (defaults to 0 on backend if undefined)
            // but you might want to make it explicit here if desired.
            return 'Initial stock is required when tracking inventory';
        }
        if (allValues.trackInventory && value < 0) {
            return 'Initial stock cannot be negative';
        }
        return undefined;
    };

   
    const transform = useCallback(async (data: any) => {
        const transformedData = { ...data,

            basePrice: parseFloat(data.basePrice) || 0, // Ensure basePrice is a number
            initialStock: data.trackInventory && data.initialStock !== undefined && data.initialStock !== null
                ? parseInt(data.initialStock, 10)
                : undefined,
                ...(!data.trackInventory && { initialStock: undefined }), // Remove initialStock if not tracking inventory
         };
        
      
        if (isAdmin && identity?.clientId) {
            transformedData.clientId = identity.clientId;
        } 
      
        if (transformedData.categoryIds && !Array.isArray(transformedData.categoryIds)) {
            transformedData.categoryIds = [transformedData.categoryIds];
        }

        console.log("Transformed Product Data:", transformedData);
        return transformedData;
    }, [isAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    
    const canCreate = isSuperAdmin || isAdmin;

    if (!canCreate) {
        return <Typography color="error">You do not have permission to create products.</Typography>;
    }

    const onSuccess = (data: any) => {
        notify('Product created successfully', { type: 'success', undoable: false });
        redirect(`/products/${data.id}`); 
    };
   
    return ( 
        <Create {...props} transform={transform} mutationOptions={{ onSuccess }}>
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
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <NumberInput
                            source="basePrice"
                            validate={required()}
                            helperText="Prix ​​de base du produit, le prix final sera calculé après ajustement du prix des variantes."
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <BooleanInput
                            source="isActive"
                            defaultValue={true}
                            helperText="Si non actif, il ne peut pas être vu par les clients"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <BooleanInput
                            source="trackInventory"
                            label="Track Inventory?"
                            defaultValue={false}
                            helperText="Si le produit a des variantes, choisissez non"
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <FormDataConsumer>
                        {({ formData, ...rest }) => formData.trackInventory && (
                            <Grid item xs={12} sm={4}>
                                <NumberInput
                                    source="initialStock"
                                    validate={validateStock} 
                                    helperText="Initial stock level (only if tracking inventory and no variants initially)"
                                    fullWidth
                                    {...rest}
                                />
                            </Grid>
                        )}
                    </FormDataConsumer>
                <TextInput source="description" validate={required()} multiline rows={3} fullWidth />
                <Grid item xs={12}>
                         <FormDataConsumer>
                             {({ formData, ...rest }) => (
                                 <ReferenceArrayInput
                                     source="categoryIds"
                                     reference="categories"
                                     filter={formData.clientId ? { clientId: formData.clientId } : {}} // Filter by selected/current client
                                     disabled={!formData.clientId && isSuperAdmin} // Disable if SuperAdmin hasn't selected a client yet
                                     helperText={!formData.clientId && isSuperAdmin ? "Select a client first" : ""}
                                     fullWidth
                                     {...rest}
                                 >
                                     <AutocompleteArrayInput
                                         optionText="name"
                                         label="Categories"
                                         // Ensure ChipProps or styling prevents overly long chips if needed
                                         sx={{ width: '100%' }}
                                     />
                                 </ReferenceArrayInput>
                             )}
                         </FormDataConsumer>
                    </Grid>
            </SimpleForm>   
        </Create>
     );
}
 
export default ProductCreate;