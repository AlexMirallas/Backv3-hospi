import { DateField, NumberField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const AttributeValueShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="value" />
            <TextField source="hexCode" />
            <NumberField source="attribute.id" />
            <ReferenceField source="attributeId" reference="attributes" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);