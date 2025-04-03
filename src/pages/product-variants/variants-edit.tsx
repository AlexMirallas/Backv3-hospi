import { ArrayInput, BooleanInput, DateInput, Edit, NumberInput, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin';

export const VariantEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="sku" />
            <TextInput source="product.id" />
            <TextInput source="priceAdjustment" />
            <NumberInput source="stockQuantity" />
            <BooleanInput source="isActive" />
            <ArrayInput source="attributeValues"><SimpleFormIterator><TextInput source="id" />
<NumberInput source="attributeValue.id" />
<NumberInput source="attribute.id" />
<DateInput source="createdAt" />
<DateInput source="updatedAt" /></SimpleFormIterator></ArrayInput>
            <DateInput source="createdAt" />
            <DateInput source="updatedAt" />
        </SimpleForm>
    </Edit>
);