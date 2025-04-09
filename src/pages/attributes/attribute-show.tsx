import { ArrayField, DateField, NumberField, Show, SimpleShowLayout, TextField, Datagrid } from 'react-admin';

export const AttributeShow = () => {
    return (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="name" />
            <ArrayField source="values" >
                <Datagrid bulkActionButtons={false} width={1/2} >
                    <TextField source="value" label="Values assigned" />
                    <TextField source="hexCode" label="Hex code" />
                </Datagrid>
            </ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
)
};