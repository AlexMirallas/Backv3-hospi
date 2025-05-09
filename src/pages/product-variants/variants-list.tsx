import { ArrayField, BooleanField, ChipField, Datagrid, EditButton, List, NumberField, NumberInput, SingleFieldList, TextField,TextInput,ShowButton,usePermissions, ReferenceManyField, } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';
import  ApiImageField  from '../../components/imageComponents/ApiImageField';

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
            <ReferenceManyField
                    label="Primary Image"
                    reference="images" 
                    target="variantId" 
                    source="id" 
                    filter={{ isPrimary: true }} 
                    sortable={false}
                    perPage={1} 
            >
                <SingleFieldList linkType={false}>
                    <ApiImageField
                        source="path"
                        title="filename"
                        sx={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
                    />
                </SingleFieldList>
            </ReferenceManyField>
            <TextField source="sku" />
            <TextField source="product.name" />
            <NumberField source="priceAdjustment" options={
                { style: 'currency', currency: 'EUR' } } />
            <NumberField source="currentStock" label="Stock actuel" options={
                { style: 'decimal', minimumFractionDigits: 0 } } emptyText='N/A'
            />
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