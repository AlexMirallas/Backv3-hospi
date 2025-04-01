import { Datagrid, DateField, List, TextField, EditButton } from 'react-admin';

export const AttributeList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" label="Nom" />
            <TextField source="position" label="Position" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
);