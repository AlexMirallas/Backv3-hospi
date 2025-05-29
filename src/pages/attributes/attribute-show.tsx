import { ArrayField, NumberField, Show, SimpleShowLayout, TextField, Datagrid } from 'react-admin';

export const AttributeShow = () => {
    return (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="name" label="Nom" />
            <ArrayField source="values" label="Valeurs" >
                <Datagrid bulkActionButtons={false} width={1/2} >
                    <TextField source="value" label="Valeurs associées à l'attribut" />
                    <TextField source="hexCode" label="Hex code sis'il s'agit d'une couleur" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
)
};