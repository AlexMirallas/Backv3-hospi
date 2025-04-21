import { Datagrid, DateField, EditButton, List, NumberField, ReferenceField, ReferenceInput, SelectInput, TextField,Loading,usePermissions } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';



export const AttributeValueList = () => {
    const {isLoading, permissions} = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');


    const attributeFilters = [
        <ReferenceInput label="Par Attribut " source="attributeId" reference="attributes" allowEmpty>
            <SelectInput optionText="name" resettable />
        </ReferenceInput>,
    ];

    if(isLoading){
        return <Loading />;
    }

    const listProps = {
        filters: attributeFilters,
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };

    
    return(
    <List {...listProps} >
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <NumberField source="position" />
            <TextField source="value" />
            <TextField source="hexCode" />
            <ReferenceField source="attributeId" reference="attributes" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};