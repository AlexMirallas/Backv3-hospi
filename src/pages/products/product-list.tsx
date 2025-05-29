import { Datagrid, DateField, List, TextField, EditButton,BooleanField, NumberField, TextInput, BooleanInput, FunctionField,ArrayField,SingleFieldList,ChipField, usePermissions, ReferenceManyField, Loading } from 'react-admin';
import { CustomCheckIcon} from '../../components/buttons-icons/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/buttons-icons/CustomCrossIcon';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';
import ApiImageField from '../../components/imageComponents/ApiImageField';



export const ProductList = () => {

    const { isLoading: permissionsLoading, permissions } = usePermissions();
    
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    const productFilters = [
        <TextInput label="Nom" source="name" resettable />,
        <TextInput label="Description" source="description" resettable  />,
        <TextInput label="SKU" source="sku" resettable />,
        <BooleanInput label="Actif" source="isActive"  />,  
    ];

    const listProps = {
        filters: productFilters,
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };
    if (permissionsLoading) {
        return <Loading/>; // or a loading spinner
    }
    
    return(
    <List {...listProps}>
        <Datagrid  rowClick="edit">
            <ReferenceManyField
                    label="Image principale"
                    reference="images" 
                    target="productId" 
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
            <TextField source="sku" label="SKU" />
            <TextField source="name" label="Nom" />
            <FunctionField source="description" label="Description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <NumberField source="basePrice" label="Prix de base" options={
                { style: 'currency', currency: 'EUR' } } 
                 />
            
            <ArrayField source="categories" label="Catégories" sortable={false}>
                <SingleFieldList linkType={false}> 
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>
            <BooleanField source="isActive" label="Actif" TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />
            <DateField source="createdAt" label="Date de création" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};