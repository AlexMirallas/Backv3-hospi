import { Datagrid, List, TextField, TextInput,SelectInput } from 'react-admin';
import { statusChoices } from '../../enums/enums';

export const ClientList = () => {



    const clientFilters = [
        <TextInput label="Nom" source="name" resettable />,
        <TextInput label="Sous-domaine" source="subdomain" resettable />,
        <SelectInput label="Statut" source="status" choices={statusChoices} resettable />,
    ];
    
    return(
    <List filters={clientFilters} >
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="subdomain" />
            <TextField source="status" />
            <TextField source="settings" />
        </Datagrid>
    </List>
)};