import { 
    Edit, 
    SimpleForm, 
    TextInput, 
    NumberInput, 
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

const UserEdit = () => {
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

        if (!transformedData.password) {
            delete transformedData.password;
        }
        
        delete transformedData.confirm_password; 

        return transformedData;
    }, [isAdmin, isSuperAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    return ( 
        <Edit transform={transform}>
            <Typography variant="h5" style={{
                marginTop: '16px',
                marginBottom: '16px',
                color: '#333333',
                textAlign: 'center',
                fontSize: '2rem'
            }}>
                Modifier un utilisateur
            </Typography>
            <SimpleForm>
                <TextInput source="email" validate={[required(), email()]} helperText="User email" fullWidth />
                <TextInput source="firstName" validate={required()} fullWidth />
                <TextInput source="lastName" validate={required()} fullWidth />
                <NumberInput source="phone" validate={required()} fullWidth />
                <PasswordInput source="password"  helperText="Laissez vide pour conserver le mot de passe actuel. Minimum 8 caractères si modifié." fullWidth />
                <PasswordInput source="confirm_password" helperText="Confirmer mot de passe" fullWidth /> 

                {(isSuperAdmin || isAdmin) && (
                    <SelectArrayInput 
                        source="roles" 
                        choices={availableRoleChoices} 
                        validate={required()} 
                        fullWidth 
                        helperText="Select user role(s)"
                    />
                )}

                {isSuperAdmin && (
                    <ReferenceInput source="clientId" reference="clients" fullWidth>
                        <AutocompleteInput optionText="name" validate={required()} helperText="Assign to a client"/>
                    </ReferenceInput>
                )}
            </SimpleForm>    
        </Edit>
     );
}
 
export default UserEdit;