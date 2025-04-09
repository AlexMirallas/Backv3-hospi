import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';
import { Typography } from '@mui/material';

const UserCreate = () => {
    return ( 
        <Create>
            <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            textAlign: 'center',
                            fontSize: '2rem'
                             }
                        }>
                            Créer un nouveau utilisateur
            </Typography>
            <SimpleForm>
                <TextInput source="email" required helperText="User email"/>
                <TextInput source="firstName" required />
                <TextInput source="lastName" required />
                <NumberInput source="phone" required  />
                <TextInput source="password" type="password" required helperText="Le mot de passe doit comporter au moins 8 caractères."/>
            </SimpleForm>    
        </Create>
     );
}
 
export default UserCreate;