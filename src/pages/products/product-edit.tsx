import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    NumberInput,
    AutocompleteArrayInput 
} from 'react-admin';

export const ProductEdit = () => (
    <Edit>
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
    </Edit>
);

