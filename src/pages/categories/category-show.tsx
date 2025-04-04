import { DateField, ReferenceField, Show, SimpleShowLayout, TextField, ArrayField, SingleFieldList } from 'react-admin';

export const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="slug" />
            <TextField source="description" />
            <ReferenceField source="parentId" reference="categories" />
            <ArrayField source="children">
                <SingleFieldList/>
            </ArrayField>
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);