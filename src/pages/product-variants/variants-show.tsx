import { ArrayField, BooleanField, Datagrid, DateField, NumberField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const VariantShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="sku" />
            <TextField source="product.name" />
            <TextField source="priceAdjustment" />
            <NumberField source="stockQuantity" />
            <BooleanField source="isActive" />
            <ArrayField source="attributeValues">
                <Datagrid bulkActionButtons={false} >
                    <TextField source="attribute.name" label="Atribute"/>
                    <TextField source="attributeValue.value" label="Value" />     
                </Datagrid>
            </ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);