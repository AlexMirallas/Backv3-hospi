import { BooleanField, DateField, Show, SimpleShowLayout, TextField, ArrayField, SingleFieldList, ChipField} from 'react-admin';

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="sku" label="SKU" />
            <TextField source="name" label="Nom" />
            <TextField source="description" label="Description" />
            <TextField source="basePrice" label="Prix de base" />
            <BooleanField source="isActive" label="Est actif"/>
            <DateField source="createdAt" label="Créé à" />
            <DateField source="updatedAt" label="mis à jour à"/>
            <ArrayField source="categories">
                <SingleFieldList linkType={false}> 
                    <ChipField source="name" label="Nom" />
                </SingleFieldList>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);