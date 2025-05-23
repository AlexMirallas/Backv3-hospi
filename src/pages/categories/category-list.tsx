import { Datagrid, List, ReferenceField, TextField, EditButton, FunctionField, ArrayField, SingleFieldList, usePermissions,Loading } from 'react-admin';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';

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
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="slug" />
            <FunctionField source="description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <ReferenceField source="parentId" reference="categories"/>
            <ArrayField source="children" sortable={false}>
                <SingleFieldList/>
            </ArrayField>
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};