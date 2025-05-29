import { EmailField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = () => (

    

    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <EmailField source="email" label="Email" />
            <TextField source="firstName" label="Prénom" />
            <TextField source="lastName" label = "Nom" />
            <TextField source="phone" label= "Numéro de téléphone" />
            <TextField source="roles" label="Rôles" />
            <TextField source="clientId" label="ID Client" />
        </SimpleShowLayout>
    </Show>
);