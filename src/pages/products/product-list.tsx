import { Datagrid, DateField, List, TextField, EditButton,BooleanField, NumberField, TextInput, BooleanInput, FunctionField,ArrayField,SingleFieldList,ChipField } from 'react-admin';

export const ProductList = () => {
    const productFilters = [
        <TextInput label="Nom" source="name" resettable />,
        <TextInput label="Description" source="description" resettable  />,
        <TextInput label="SKU" source="sku" resettable />,
        <BooleanInput label="Actif" source="isActive" />,  
    ];
    
    return(
    <List filters={productFilters}>
        <Datagrid>
            <TextField source="sku" label="SKU" />
            <TextField source="name" label="Nom" />
            <FunctionField source="description" label="Description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <NumberField source="basePrice" label="Prix" options={
                { style: 'currency', currency: 'EUR' } } 
                 />
            <BooleanField source="isActive" label="Actif" />
            <ArrayField source="categories" label="Catégories">
                            <SingleFieldList linkType={false}> 
                                <ChipField source="name" />
                            </SingleFieldList>
                        </ArrayField>
            { /*<FunctionField label="Image" render={record => <img src={record.imageUrl} alt={record.name} style={{ width: '50px' }} />} />*/}
            <DateField source="createdAt" label="Date de création" />
            <DateField source="updatedAt" label="Date de mise à jour" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};