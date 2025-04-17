import { 
    Create, 
    SimpleForm, 
    TextInput, 
    NumberInput, 
    PasswordInput, // Use PasswordInput for better UX
    SelectArrayInput, // For selecting multiple roles
    ReferenceInput,   // For selecting clientId
    AutocompleteInput, // For clientId selection
    usePermissions, 
    useGetIdentity,
    Loading,
    required, // Import required validator
    email // Import email validator
} from 'react-admin';
import { Typography } from '@mui/material';
import { useCallback, useMemo } from 'react'; // Import useMemo
import { roleChoices as allRoleChoices } from '../../enums/enums'; // Rename imported choices

const UserCreate = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();

    // Determine roles based on permissions
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;

    // Filter role choices based on the current user's role
    const availableRoleChoices = useMemo(() => {
        if (isSuperAdmin) {
            return allRoleChoices; // Superadmin sees all roles
        } else if (isAdmin) {
            // Admin can create 'admin' or 'user' roles, but not 'superadmin'
            return allRoleChoices.filter(role => role.id === 'admin' || role.id === 'user');
        }
        return []; // No choices if neither admin nor superadmin (shouldn't happen in create context)
    }, [isSuperAdmin, isAdmin]);

    // Transform function to add clientId for admin users
    const transform = useCallback(async (data: any) => {
        const transformedData = { ...data };
        
        // If the current user is an admin (not superadmin), set the clientId automatically
        if (isAdmin && identity?.clientId) {
            transformedData.clientId = identity.clientId;
            // Roles are now selected via the form, ensure it's an array
            if (transformedData.roles && !Array.isArray(transformedData.roles)) {
                transformedData.roles = [transformedData.roles];
            } else if (!transformedData.roles) {
                // Default to 'user' if no role was somehow selected (though validation should prevent this)
                transformedData.roles = ['user']; 
            }
        } else if (isSuperAdmin) {
            // Ensure roles is an array if selected
            if (transformedData.roles && !Array.isArray(transformedData.roles)) {
                transformedData.roles = [transformedData.roles];
            }
        }
        
        // Remove password confirmation if you add it
        delete transformedData.confirm_password; 

        console.log("Transformed User Data:", transformedData);
        return transformedData;
    }, [isAdmin, isSuperAdmin, identity]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    // Determine if the user has permission to create any users
    const canCreate = isSuperAdmin || isAdmin;

    if (!canCreate) {
        // Optional: Show a message or redirect if the user shouldn't be here
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
                <TextInput source="email" validate={[required(), email()]} helperText="User email" fullWidth />
                <TextInput source="firstName" validate={required()} fullWidth />
                <TextInput source="lastName" validate={required()} fullWidth />
                <NumberInput source="phone" validate={required()} fullWidth />
                <PasswordInput source="password" validate={required()} helperText="Le mot de passe doit comporter au moins 8 caractères." fullWidth />
                <PasswordInput source="confirm_password" validate={required()} helperText="Confirm password" fullWidth /> 

                {/* Role Selection - Visible to SuperAdmin and Admin */}
                {(isSuperAdmin || isAdmin) && (
                    <SelectArrayInput 
                        source="roles" 
                        choices={availableRoleChoices} // Use filtered choices
                        validate={required()} 
                        fullWidth 
                        helperText="Select user role(s)"
                    />
                )}

                {/* Client Selection - Visible ONLY to SuperAdmin */}
                {isSuperAdmin && (
                    <ReferenceInput source="clientId" reference="clients" fullWidth>
                        <AutocompleteInput optionText="name" validate={required()} helperText="Assign to a client"/>
                    </ReferenceInput>
                )}

                {/* Display Client for Admin (Read-only - Informational, could be removed) */}
                {/* This might be redundant now as clientId is handled in transform */}
                {/* {isAdmin && identity?.clientId && (
                     <TextInput source="clientId" defaultValue={identity.clientId} disabled fullWidth label="Client ID (Auto-assigned)" />
                )} */}
            </SimpleForm>    
        </Create>
     );
}
 
export default UserCreate;