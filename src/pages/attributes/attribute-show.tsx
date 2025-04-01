import { DateField, NumberField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const AttributeShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="name" />
            <TextField source="values" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);