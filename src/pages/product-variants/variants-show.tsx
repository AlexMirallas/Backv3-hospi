import { ArrayField, BooleanField, Datagrid, DateField, NumberField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const VariantShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="sku" />
            <TextField source="product.id" />
            <TextField source="priceAdjustment" />
            <NumberField source="stockQuantity" />
            <BooleanField source="isActive" />
            <ArrayField source="attributeValues"><Datagrid><TextField source="id" />
<NumberField source="attributeValue.id" />
<NumberField source="attribute.id" />
<DateField source="createdAt" />
<DateField source="updatedAt" /></Datagrid></ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);