import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

const UserCreate = () => {
    return ( 
        <Create>
            <SimpleForm>
                <TextInput source="email" required/>
                <TextInput source="firstName" required />
                <TextInput source="lastName" required />
                <NumberInput source="phone" required />
                <TextInput source="password" type="password" required/>
            </SimpleForm>    
        </Create>
     );
}
 
export default UserCreate;