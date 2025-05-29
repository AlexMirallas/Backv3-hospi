import { 
    Create, 
    SimpleForm, 
    TextInput, 
    BooleanInput, 
    NumberInput,
    usePermissions,
    useGetIdentity,
    Loading,
    ReferenceInput,
    AutocompleteInput,
    required
} from 'react-admin';
import { Typography, Box } from '@mui/material';
import { useCallback } from 'react';

const AttributeCreate = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();

    const isSuperAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;

    const transform = useCallback(async (data: any) => {
        const transformedData = { ...data };
        if (isAdmin && identity?.clientId) {
            transformedData.clientId = identity.clientId;
        }
        console.log("Transformed Attribute Data:", transformedData);
        return transformedData;
    }, [isAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    const canCreate = isSuperAdmin || isAdmin;

    if (!canCreate) {
        return <Typography color="error">Vous n'avez pas l'autorisation de créer des attributs.</Typography>;
    }

    return ( 
        <Create transform={transform}>
            <Typography variant="h5" style={
                { marginTop: '16px',
                marginBottom: '16px',
                fontWeight: 'bold',
                color: '#333333',
                textAlign: 'center',
                fontSize: '2rem'
                 }
            }>Créer un nouvel attribut</Typography>
            <SimpleForm>
                {isSuperAdmin && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <ReferenceInput source="clientId" reference="clients" fullWidth>
                            <AutocompleteInput optionText="name" validate={required()} helperText="Attribuer un attribut à un client"/>
                        </ReferenceInput>
                    </Box>
                )}

                <TextInput 
                    source="name" 
                    validate={required()}
                    helperText="(ex: Couleur, Taille, etc.)"
                    fullWidth
                    label="Nom de l'attribut"
                 />
                <NumberInput 
                    source="position"
                    validate={required()}
                    helperText="Position de l'attribut"
                    min={1}
                    fullWidth
                 />  
                <BooleanInput source="isActive" label="Est actif" defaultValue={true} fullWidth />    
            </SimpleForm>    
        </Create>
     );
}
 
export default AttributeCreate;
