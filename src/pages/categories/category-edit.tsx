import { DateInput, Edit, SimpleForm, TextInput } from 'react-admin';

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="slug" />
            <TextInput source="description" />
            <TextInput source="children" />
            <TextInput source="parent" />
            <TextInput source="products" />
            <DateInput source="createdAt" />
            <DateInput source="updatedAt" />
        </SimpleForm>
    </Edit>
);