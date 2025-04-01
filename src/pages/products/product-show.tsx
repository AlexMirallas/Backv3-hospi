import { BooleanField, DateField, Show, SimpleShowLayout, TextField, ArrayField, SingleFieldList, ChipField} from 'react-admin';

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="sku" />
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="basePrice" />
            <BooleanField source="isActive" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <ArrayField source="categories">
                <SingleFieldList linkType={false}> 
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);