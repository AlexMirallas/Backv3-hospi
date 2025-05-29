import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const ClientShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nom" />
            <TextField source="subdomain" label="Sous-domaine" />
            <TextField source="status" />
            <TextField source="settings" />
            <DateField source="createdAt" label="Créé à" />
            <DateField source="updatedAt" label="Mis à jour à" />
        </SimpleShowLayout>
    </Show>
);