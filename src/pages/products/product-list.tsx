import { Datagrid, DateField, List, TextField, EditButton,BooleanField, NumberField, TextInput, BooleanInput, FunctionField,ArrayField,SingleFieldList,ChipField, usePermissions, ReferenceManyField } from 'react-admin';
import { CustomCheckIcon} from '../../components/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/CustomCrossIcon';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';
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
    
    return(
    <List {...listProps}>
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }} rowClick="edit">
            <ReferenceManyField
                    label="Primary Image"
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
            <NumberField source="basePrice" label="Prix" options={
                { style: 'currency', currency: 'EUR' } } 
                 />
            <BooleanField source="isActive" label="Actif" TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />
            <ArrayField source="categories" label="Catégories" sortable={false}>
                <SingleFieldList linkType={false}> 
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>
            <DateField source="createdAt" label="Date de création" />
            <DateField source="updatedAt" label="Date de mise à jour" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};