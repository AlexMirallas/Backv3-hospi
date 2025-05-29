import { Datagrid, List, ReferenceField, TextField, EditButton, FunctionField, ArrayField, SingleFieldList, usePermissions,Loading } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/admin/SuperAdminClientFilterList';

export const CategoryList = () => {
    const {isLoading, permissions} = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    const listProps = {
        ...(isSuperAdmin ? { aside: <SuperAdminClientFilterList /> } : {}),
    };

    if (isLoading) {
        return <Loading />;
    }
    
    return (
    <List {...listProps} >
        <Datagrid >
            <TextField source="id" />
            <TextField source="name" label="Nom" />
            <TextField source="slug" label="Slug" />
            <FunctionField source="description" label="Déscription" render={(record) => `${record.description.substring(0,30)} ...`} />
            <ReferenceField source="parentId" reference="categories"/>
            <ArrayField source="children" sortable={false} label="Enfant">
                <SingleFieldList />
            </ArrayField>
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};