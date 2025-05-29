import { Datagrid, List, TextField, EditButton, BooleanField,usePermissions,Loading } from 'react-admin';
import { CustomCheckIcon } from '../../components/buttons-icons/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/buttons-icons/CustomCrossIcon';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';

export const AttributeList = () => {

    const { isLoading, permissions } = usePermissions();

    if (isLoading) {
        return <Loading/>
    }

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    const listProps = {
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };

    
    return(
    <List {...listProps}>
        <Datagrid>
            <TextField source="name" label="Nom" />
            <TextField source="position" label="Position" />
            <BooleanField source="isActive" label="Actif" TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />            
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};