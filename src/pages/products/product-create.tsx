import { Stack } from '@mui/material';
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



const ProductCreate:React.FC<CreateProps> = (props) => {
   
    return ( 
        <Create {...props}>
            <SimpleForm >
                <Stack direction="row" spacing={2} mb={2}>
                    <TextInput source="sku" required />
                    <TextInput source="name" required />
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <NumberInput source="basePrice" required  />
                    <BooleanInput source="isActive"/>
                </Stack>
                <TextInput source="description" required multiline rows={3} />
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