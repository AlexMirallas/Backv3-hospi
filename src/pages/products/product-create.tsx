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
import { Typography } from '@mui/material';



const ProductCreate:React.FC<CreateProps> = (props) => {
   
    return ( 
        <Create {...props}>
            <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            textAlign: 'center',
                            fontSize: '2rem'
                             }
                        }>
                            Créer un nouveau produit
            </Typography>
            <SimpleForm >
                <Stack direction="row" spacing={2} mb={2}>
                    <TextInput source="sku" required helperText="Numéro d'unité de gestion des stocks, doit être unique"/>
                    <TextInput source="name" required helperText="Nom de produit"/>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <NumberInput source="basePrice" required helperText="Prix ​​de base du produit, le prix final sera calculé après ajustement du prix des variantes."/>
                    <BooleanInput source="isActive" helperText="Si non actif, il ne peut pas être vu par les clients"/>
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