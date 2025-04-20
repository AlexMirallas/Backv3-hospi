import { Datagrid, EditButton, EmailField, List, TextField,Loading, TextInput,SelectInput, ShowButton, ReferenceField,usePermissions } from 'react-admin';
import { roleChoices } from '../../enums/enums';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';

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
    return(
    <List filters={userFilters} aside={<SuperAdminClientFilterList/>}>
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="firstName" />
            <TextField source="lastName" />
            <EmailField source="email" />
            <TextField source="roles" />
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