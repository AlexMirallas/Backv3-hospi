import { ArrayField, BooleanField, ChipField, Datagrid, DateField, EditButton, List, NumberField, NumberInput, SingleFieldList, TextField,TextInput,ShowButton,usePermissions } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';

export const VariantList = () =>{
    
    const {isLoading, permissions} = usePermissions();

    const variantFilters = [
        <TextInput label="Product Name" source="name" resettable />,
        <NumberInput label="Stock" source="stockQuantity" />,
    ]

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    
    const listProps = {
        filters: variantFilters,
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };

    if (isLoading) {
        return null; 
    }

    return(
    <List {...listProps}>
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
            <EditButton label='Modifier' />
            <ShowButton label='Détails' />
        </Datagrid>
    </List>
)};