import { Datagrid, DateField, List, TextField, EditButton,BooleanField, NumberField, TextInput, BooleanInput, FunctionField,ArrayField,SingleFieldList,ChipField } from 'react-admin';
import { CustomCheckIcon} from '../../components/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/CustomCrossIcon';



export const ProductList = () => {
    const productFilters = [
        <TextInput label="Nom" source="name" resettable />,
        <TextInput label="Description" source="description" resettable  />,
        <TextInput label="SKU" source="sku" resettable />,
        <BooleanInput label="Actif" source="isActive"  />,  
    ];
    
    return(
    <List filters={productFilters}>
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="sku" label="SKU" />
            <TextField source="name" label="Nom" />
            <FunctionField source="description" label="Description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <NumberField source="basePrice" label="Prix" options={
                { style: 'currency', currency: 'EUR' } } 
                 />
            <BooleanField source="isActive" label="Actif" TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />
            <ArrayField source="categories" label="Catégories" sortable={false}>
                <SingleFieldList linkType={false}> 
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>
            { /* Reminder When to add Image uncomment: <FunctionField label="Image" render={record => <img src={record.imageUrl} alt={record.name} style={{ width: '50px' }} />} />*/}
            <DateField source="createdAt" label="Date de création" />
            <DateField source="updatedAt" label="Date de mise à jour" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};