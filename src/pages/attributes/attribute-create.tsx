import { Create, SimpleForm, TextInput, BooleanInput, NumberInput } from 'react-admin';
import { Typography } from '@mui/material';

const AttributeCreate = () => {
    return ( 
        <Create >
            <Typography variant="h5" style={
                { marginTop: '16px',
                marginBottom: '16px',
                fontWeight: 'bold',
                color: '#333333',
                textAlign: 'center',
                fontSize: '2rem'
                 }
            }>Créer un nouvel attribut</Typography>
            <SimpleForm>
                <TextInput 
                source="name" 
                required
                helperText="Nom de l'attribut(ex: Couleur)"
                validate={value => value ? undefined : 'Required'}
                 />
                <NumberInput 
                source="position"
                required
                helperText="Position de l'attribut"
                validate={value => value ? undefined : 'Required'}
                min={1}
                 />  
                <BooleanInput source="isActive" defaultValue={true} />    
            </SimpleForm>    
        </Create>
     );
}
 
export default AttributeCreate;