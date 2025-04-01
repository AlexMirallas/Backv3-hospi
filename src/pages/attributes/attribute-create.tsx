import { Create, SimpleForm, TextInput, BooleanInput, NumberInput } from 'react-admin';

const AttributeCreate = () => {
    return ( 
        <Create>
            <SimpleForm>
                <TextInput source="name" required />
                <NumberInput source="position" required />  
                <BooleanInput source="isActive" defaultValue={true} />    
            </SimpleForm>    
        </Create>
     );
}
 
export default AttributeCreate;