import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    NumberInput,
    AutocompleteArrayInput,
    EditProps,
} from 'react-admin';
import { ExistingVariantsList } from '../product-variants/product-variant-list';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography } from '@mui/material';





export const ProductEdit:React.FC<EditProps> = (props) => {

    return(
    <>
        <Edit {...props} title= {`Edit Product`} redirect="list" mutationMode='pessimistic' > 
            <SimpleForm >
                <TextInput source="id" disabled />
                <TextInput source="sku" label="SKU" required helperText="Numéro d'unité de gestion des stocks, doit être unique"/> 
                <TextInput source="name" required helperText="Nom de produit" />
                <TextInput source="description" multiline rows={3} />
                <NumberInput source="basePrice" required helperText="Prix ​​de base du produit, le prix final sera calculé après ajustement du prix des variantes." /> 
                <BooleanInput source="isActive" helperText="Si non actif, il ne peut pas être vu par les clients"/>
                <ReferenceArrayInput source="categoryIds" reference="categories">
                    <AutocompleteArrayInput
                        optionText="name"
                        optionValue="id" 
                        fullWidth 
                        label="Categories" 
                    />
                </ReferenceArrayInput>  
            </SimpleForm>
            <ExistingVariantsList  />
            <Card sx={{ marginTop: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Add New Variant</Typography>
                    <AddNewVariantForm />
                </CardContent>
            </Card>   
        </Edit>
    </>
)};

