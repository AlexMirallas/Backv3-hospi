import { ArrayField, BooleanField, ChipField, Datagrid, DateField, EditButton, List, NumberField, NumberInput, SingleFieldList, TextField,TextInput,ShowButton } from 'react-admin';

export const VariantList = () =>{
    
    const variantFilters = [
        <TextInput label="Product Name" source="name" resettable />,
        <NumberInput label="Stock" source="stockQuantity" />,]

    return(
    <List filters={variantFilters}>
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
            <EditButton label='Modifier' />
            <ShowButton label='Détails' />
        </Datagrid>
    </List>
)};