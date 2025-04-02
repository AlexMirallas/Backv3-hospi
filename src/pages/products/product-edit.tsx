import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    NumberInput,
    AutocompleteArrayInput,
    EditProps
} from 'react-admin';
import { ExistingVariantsList } from '../product-variants/product-variant-list';
import { AddNewVariantForm } from '../product-variants/addNewVariantForm';
import { Card, CardContent, Typography } from '@mui/material';



export const ProductEdit:React.FC<EditProps> = (props) => {
   
    return(
    <Edit {...props} title="Edit Product" undoable={false}>
        <SimpleForm >
            <TextInput source="id" disabled />
            <TextInput source="sku" label="SKU" required /> 
            <TextInput source="name" required />
            <TextInput source="description" multiline rows={3} />
            <NumberInput source="basePrice" required /> 
            <BooleanInput source="isActive" defaultValue={true} />
            <ReferenceArrayInput source="categoryIds" reference="categories">
                <AutocompleteArrayInput
                    optionText="name"
                    optionValue="id" 
                    fullWidth 
                    label="Categories" 
                />
            </ReferenceArrayInput>  
        </SimpleForm>
        {/* --- Section for Existing Variants --- */}
        <ExistingVariantsList />
        {/* --- Section for Adding a New Variant --- */}
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Add New Variant</Typography>
                    <AddNewVariantForm />
                </CardContent>
        </Card>   
    </Edit>
)};

