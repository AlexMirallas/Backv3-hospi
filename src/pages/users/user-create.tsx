import { Create, SimpleForm, TextInput, BooleanInput, NumberInput, ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

const UserCreate = () => {
    return ( 
        <Create>
            <SimpleForm>
                <TextInput source="email" />
                <TextInput source="firstName" />
                <TextInput source="lastName" />
                <NumberInput source="phone" />
                <TextInput source="password" type="password" />
            </SimpleForm>    
        </Create>
     );
}
 
export default UserCreate;