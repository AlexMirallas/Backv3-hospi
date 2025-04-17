import { EmailField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <EmailField source="email" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="phone" />
            <TextField source="roles" />
            <TextField source="clientId" label="Client ID" />
        </SimpleShowLayout>
    </Show>
);