import { Datagrid, DateField, List, TextField } from 'react-admin';

export const ClientList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="subdomain" />
            <TextField source="status" />
            <TextField source="settings" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </Datagrid>
    </List>
);