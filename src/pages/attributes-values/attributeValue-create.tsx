import{ Create, SimpleForm, TextInput, ReferenceInput, SelectInput,NumberInput } from "react-admin";

const AttributeValueCreate = () => {


    return (
        <Create>
            <SimpleForm>
                <ReferenceInput source="attributeId" reference="attributes">
                    <SelectInput optionText="name" />
                </ReferenceInput>     
                <TextInput source="value"  required />
                <NumberInput source="position"  required />
                <TextInput source="hexcode" label="Hex Code if colour" />
            </SimpleForm>
        </Create>
    );
};

export default AttributeValueCreate;