import { Datagrid, DateField, EditButton, List, NumberField, ReferenceField, TextField } from 'react-admin';

export const AttributeValueList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="value" />
            <TextField source="hexCode" />
            <ReferenceField source="attributeId" reference="attributes" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
);