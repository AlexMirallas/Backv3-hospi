import { Datagrid, DateField, EditButton, EmailField, List, TextField, TextInput,SelectInput } from 'react-admin';

export const UserList = () => {

    const rolesChoices = [
       "admin","user"
    ];

    const userFilters = [
        <TextInput label="Email" source="email" resettable />,
        <TextInput label="Nom" source="lastName" resettable />,
        <TextInput label="Prénom" source="firstName" resettable />,
        <TextInput label="Téléphone" source="phone" resettable />,
        <SelectInput label="Rôles" choices={rolesChoices} source="roles"/>
        
    ];
    return(
    <List filters={userFilters}>
        <Datagrid>
            <TextField source="id" />
            <EmailField source="email" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="phone" />
            <TextField source="roles" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};