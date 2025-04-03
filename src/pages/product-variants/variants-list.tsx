import { ArrayField, BooleanField, ChipField, Datagrid, DateField, List, NumberField, SingleFieldList, TextField } from 'react-admin';

export const VariantList = () => (
    <List>
        <Datagrid>
            <TextField source="sku" />
            <TextField source="product.name" />
            <TextField source="priceAdjustment" />
            <NumberField source="stockQuantity" />
            <BooleanField source="isActive" />
            <ArrayField source="attributeValues">
                <SingleFieldList>
                    <ChipField source="attributeValue.value" />
                </SingleFieldList>
            </ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </Datagrid>
    </List>
);