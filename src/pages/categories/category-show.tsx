import { DateField, ReferenceField, Show, SimpleShowLayout, TextField, ArrayField, SingleFieldList } from 'react-admin';

export const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nom"/>
            <TextField source="slug" label="Slug" />
            <TextField source="description" label="Déscription" />
            <ReferenceField source="parentId" reference="categories" label="Parent" emptyText='N/A' />
            <ArrayField source="children" label="Enfant">
                <SingleFieldList empty={<span>N/A</span>} />
            </ArrayField>
            <DateField source="createdAt" label="Créé à" />
            <DateField source="updatedAt" label="Mis à jour à" />
        </SimpleShowLayout>
    </Show>
);