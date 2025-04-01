import {  Edit, NumberInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin';

export const AttributeValueEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="position" />
            <TextInput source="value" />
            <TextInput source="hexCode" />
            <ReferenceInput source="attributeId" reference="attributes" /> 
        </SimpleForm>
    </Edit>
);