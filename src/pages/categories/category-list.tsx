import { Datagrid, DateField, List, ReferenceField, TextField, EditButton, FunctionField, ArrayField, ChipField, SingleFieldList } from 'react-admin';

export const CategoryList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="slug" />
            <FunctionField source="description" render={(record) => `${record.description.substring(0,30)} ...`} />
            <ReferenceField source="parentId" reference="categories"/>
            <ArrayField source="children">
                <SingleFieldList/>
            </ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
);