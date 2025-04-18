import { Edit, ReferenceInput, SimpleForm, TextInput, usePermissions,AutocompleteInput,Loading, SelectArrayInput } from 'react-admin';
import { roleChoices } from '../../enums/enums';

export const UserEdit = () => {
    const { isLoading, permissions } = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;
    console.log("isSuperAdmin", isSuperAdmin);

    if (isLoading) {
        return <Loading/>
    }
    
    return(    
    <Edit>        
        <SimpleForm>            
                <TextInput source="id" disabled />
                <TextInput source="email" required />
                <TextInput source="firstName" required />            
                <TextInput source="lastName" required />            
                <TextInput source="phone" required />
                {isSuperAdmin && (
                    <>
                        <ReferenceInput source="clientId" reference="clients" label="Client">
                            <AutocompleteInput optionText="name" />
                        </ReferenceInput>
                        <SelectArrayInput source="roles" choices={roleChoices} helperText="Select user roles"/>
                    </>
                )}
                {isAdmin && (<TextInput source="roles" disabled />  )}            
                                
        </SimpleForm>    
    </Edit>)
    };