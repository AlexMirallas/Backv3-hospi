import { Edit, SimpleForm, TextInput, required,SelectInput } from 'react-admin';
import { statusChoices } from '../../enums/enums';


export const ClientEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled/>
            <TextInput source="name" label="Nom" validate={required()}/>
            <TextInput source="subdomain" label="Sous-domaine" validate={required()} />
            <SelectInput 
                source="status" 
                choices={statusChoices} 
                validate={required()} 
                fullWidth 
            />
            <TextInput source="settings" multiline/>
        </SimpleForm>
    </Edit>
);