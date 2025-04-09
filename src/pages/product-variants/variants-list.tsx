import { ArrayField, BooleanField, ChipField, Datagrid, DateField, EditButton, List, NumberField, NumberInput, SingleFieldList, TextField,TextInput,ShowButton } from 'react-admin';

export const VariantList = () =>{
    
    const variantFilters = [
        <TextInput label="Product Name" source="name" resettable />,
        <NumberInput label="Stock" source="stockQuantity" />,]

    return(
    <List filters={variantFilters}>
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="sku" />
            <TextField source="product.name" />
            <NumberField source="priceAdjustment" options={
                { style: 'currency', currency: 'EUR' } } />
            <NumberField source="stockQuantity" />
            <BooleanField source="isActive" />
            <ArrayField source="attributeValues" sortable={false}>
                <SingleFieldList linkType={false}>
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