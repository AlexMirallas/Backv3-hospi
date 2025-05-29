import { 
    Create, 
    SimpleForm, 
    TextInput, 
    required,
    SelectInput, 
} from 'react-admin';
import {  Typography } from '@mui/material';
import { statusChoices } from '../../enums/enums';

export const ClientCreate = () => (
    <Create>
        <Typography variant="h5" style={
            { marginTop: '16px',
              marginBottom: '16px',
              color: '#333333',
              textAlign: 'center',
              fontSize: '2rem'
            }
        }>
            Créer un nouveau client
        </Typography>
        <SimpleForm>
            <TextInput source="name" label="Nom" validate={required()} fullWidth helperText="Nom du client"/>
            <TextInput source="subdomain" label="Sous-domaine" validate={required()} fullWidth helperText="Sous-domaine unique (ex: monclient)"/>
            <SelectInput 
                source="status" 
                choices={statusChoices} 
                defaultValue="active" 
                validate={required()} 
                fullWidth 
                helperText="Statut du client"
            />
            <TextInput source="settings" multiline fullWidth helperText="Paramètres (JSON ou format spécifique)"/> 
        </SimpleForm>
    </Create>
);
