import { Datagrid, EditButton, EmailField, List, TextField,Loading, TextInput,SelectInput, ShowButton, ReferenceField,usePermissions } from 'react-admin';
import { roleChoices } from '../../enums/enums';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';

export const UserList = () => {
    const {isLoading, permissions} = usePermissions();
    const rolesChoices = roleChoices;

    const userFilters = [
        <TextInput label="Email" source="email" resettable />,
        <TextInput label="Nom" source="lastName" resettable />,
        <TextInput label="Prénom" source="firstName" resettable />,
        <TextInput label="Téléphone" source="phone" resettable />,
        <SelectInput label="Rôles" choices={rolesChoices} source="roles"/>
        
    ];

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    if (isLoading) {
        return <Loading/>
    }

    const listProps = {
        filters: userFilters,
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };
    return(
    <List {...listProps}>
        <Datagrid >
            <TextField source="firstName" label="Prénom" />
            <TextField source="lastName" label="Nom" />
            <EmailField source="email" label="Email" />
            <TextField source="roles" label="Rôles" />
            {isSuperAdmin && (
                    <ReferenceField source="clientId" reference="clients" label="Client" >
                        <TextField source="name" />
                    </ReferenceField>
            )}
            <ShowButton label='Détails' />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};