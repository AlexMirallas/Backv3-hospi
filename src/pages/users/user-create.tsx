import { 
    Create, 
    SimpleForm, 
    TextInput, 
    PasswordInput, 
    SelectArrayInput, 
    ReferenceInput,   
    AutocompleteInput, 
    usePermissions, 
    useGetIdentity,
    Loading,
    required, 
    email 
} from 'react-admin';
import { Typography } from '@mui/material';
import { useCallback, useMemo } from 'react'; 
import { roleChoices as allRoleChoices } from '../../enums/enums'; 

const UserCreate = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;

    const availableRoleChoices = useMemo(() => {
        if (isSuperAdmin) {
            return allRoleChoices;
        } else if (isAdmin) {
            return allRoleChoices.filter(role => role.id === 'admin' || role.id === 'user');
        }
        return [];
    }, [isSuperAdmin, isAdmin]);

    const transform = useCallback(async (data: any) => {
        const transformedData = { ...data };
        
        if (isAdmin && identity?.clientId) {
            transformedData.clientId = identity.clientId;
            if (transformedData.roles && !Array.isArray(transformedData.roles)) {
                transformedData.roles = [transformedData.roles];
            } else if (!transformedData.roles) {
                transformedData.roles = ['user']; 
            }
        } else if (isSuperAdmin) {
            if (transformedData.roles && !Array.isArray(transformedData.roles)) {
                transformedData.roles = [transformedData.roles];
            }
        }
        
        delete transformedData.confirm_password; 

        console.log("Transformed User Data:", transformedData);
        return transformedData;
    }, [isAdmin, isSuperAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    const canCreate = isSuperAdmin || isAdmin;

    if (!canCreate) {
        return <Typography color="error">You do not have permission to create users.</Typography>;
    }

    return ( 
        <Create transform={transform}>
            <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            textAlign: 'center',
                            fontSize: '2rem'
                             }
                        }>
                            Créer un nouveau utilisateur
            </Typography>
            <SimpleForm>
                <TextInput source="email" validate={[required(), email()]} helperText="Email Utilisateur" fullWidth />
                <TextInput source="firstName" label="Prenom" validate={required()} fullWidth />
                <TextInput source="lastName" label="Nom" validate={required()} fullWidth />
                <TextInput source="phone" label="Numéro de téléphone" validate={required()} fullWidth />
                <PasswordInput source="password" label="Mot de passe" validate={required()} helperText="Le mot de passe doit comporter au moins 8 caractères." fullWidth />
                <PasswordInput source="confirm_password" label="Confirmer mot de passe" validate={required()} fullWidth /> 

                {(isSuperAdmin || isAdmin) && (
                    <SelectArrayInput 
                        source="roles" 
                        choices={availableRoleChoices} 
                        validate={required()} 
                        fullWidth
                        label="Rôles"
                        helperText="Sélectionnez les rôles de l'utilisateur"
                    />
                )}

                {isSuperAdmin && (
                    <ReferenceInput source="clientId" reference="clients"  fullWidth>
                        <AutocompleteInput optionText="name" validate={required()} label="Client" helperText="Client pour lequel l'utilisateur travaille"/>
                    </ReferenceInput>
                )}
            </SimpleForm>    
        </Create>
     );
}
 
export default UserCreate;
