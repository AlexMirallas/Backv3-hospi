import { Datagrid, DateField, EditButton, List, NumberField, ReferenceField, ReferenceInput, SelectInput, TextField,Loading,usePermissions } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';



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
        <Datagrid >
            <NumberField source="position" />
            <TextField source="value" label="Valeur" />
            <TextField source="hexCode" label="Code Hex" />
            <ReferenceField source="attributeId" reference="attributes" label="Attribut" />
            <DateField source="createdAt" label="Créé à" />
            <DateField source="updatedAt" label="Mis à jour à" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};