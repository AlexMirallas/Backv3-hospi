import { Datagrid, DateField, EditButton, EmailField, List, TextField, TextInput,SelectInput, ShowButton } from 'react-admin';

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
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="firstName" />
            <TextField source="lastName" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="roles" />
            <DateField source="createdAt" />
            <ShowButton label='Détails' />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};