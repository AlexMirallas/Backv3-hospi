import { Datagrid, DateField, List, ReferenceField, TextField, EditButton, FunctionField } from 'react-admin';

export const CategoryList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="slug" />
            <FunctionField source="description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <TextField source="children" />
            <TextField source="parent" />
            <ReferenceField source="parentId" reference="parents" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
);