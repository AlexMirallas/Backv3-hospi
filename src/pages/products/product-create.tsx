import { Create, SimpleForm, TextInput, BooleanInput, NumberInput } from 'react-admin';

const ProductCreate = () => {
    return ( 
        <Create>
            <SimpleForm>
                <TextInput source="sku" />
                <TextInput source="name" />
                <TextInput source="description" />
                <NumberInput source="basePrice" />
                <BooleanInput source="isActive"/>
            </SimpleForm>    
        </Create>
     );
}
 
export default ProductCreate;