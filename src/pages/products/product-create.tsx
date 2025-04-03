import { 
Create,
SimpleForm, 
TextInput, 
BooleanInput, 
NumberInput, 
ReferenceArrayInput, 
AutocompleteArrayInput,
CreateProps,

} from 'react-admin';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography } from '@mui/material';



const ProductCreate:React.FC<CreateProps> = (props) => {
   
    return ( 
        <Create {...props}>
            <SimpleForm >
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