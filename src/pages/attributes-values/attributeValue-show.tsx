import { DateField, NumberField, ReferenceField, Show, usePermissions, Loading, SimpleShowLayout, TextField } from 'react-admin';

export const AttributeValueShow = () => {
    const {isLoading, permissions} = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
    
    if(isLoading){
        return <Loading />;
    }

    return(
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            {isSuperAdmin && (
                <ReferenceField source="clientId" reference="clients" label="Client" >
                    <TextField source="name" />
                </ReferenceField>
            )}
            <NumberField source="position" />
            <TextField source="value" />
            <TextField source="hexCode" />
            <NumberField source="attribute.id" />
            <ReferenceField source="attributeId" reference="attributes" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
)};