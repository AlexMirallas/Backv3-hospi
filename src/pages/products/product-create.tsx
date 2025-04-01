import { Create, SimpleForm, TextInput, BooleanInput, NumberInput, ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

const ProductCreate = () => {
    return ( 
        <Create>
            <SimpleForm>
                <TextInput source="sku" required />
                <TextInput source="name" required />
                <TextInput source="description" required />
                <NumberInput source="basePrice" required />
                <BooleanInput source="isActive"/>
                <ReferenceArrayInput source="categoryIds" reference="categories">
                    <AutocompleteArrayInput
                        optionText="name"
                        optionValue="id"
                        fullWidth 
                        label="Categories" 
                    />
                </ReferenceArrayInput>
            </SimpleForm>    
        </Create>
     );
}
 
export default ProductCreate;