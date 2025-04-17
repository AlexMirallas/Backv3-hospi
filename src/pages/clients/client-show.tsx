import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const ClientShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="subdomain" />
            <TextField source="status" />
            <TextField source="settings" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);