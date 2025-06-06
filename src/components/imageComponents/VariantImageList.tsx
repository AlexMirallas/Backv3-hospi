import {
    Datagrid,
    TextField,
    BooleanField,
    NumberField,
    DeleteButton,
    ReferenceManyField,
    useRecordContext,
    EditButton 
} from 'react-admin';
import { Typography, Card, CardContent } from '@mui/material';
import { ProductImage } from '../../types/types';
import ApiImageField from './ApiImageField'; 

export const VariantImageList = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Card sx={{ marginTop: 2, width: '100', alignSelf: 'left' }} >
            <CardContent>
                <Typography variant="h6" gutterBottom>Gérer les images de produits</Typography>
                <ReferenceManyField<ProductImage>
                    label={false}
                    reference="images"
                    target="variantId"
                    source="id"
                    sort={{ field: 'displayOrder', order: 'ASC' }}
                    perPage={10}
                >
                    <Datagrid bulkActionButtons={false} optimized rowClick="edit">
                        <ApiImageField
                            source="path"
                            title="filename"
                            label="Image"
                            sx={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
                        />
                        <TextField source="altText" label="Alt Text" sortable={false}/>
                        <NumberField source="displayOrder" label="Ordre" sortable={false}/>
                        <BooleanField source="isPrimary" label="Image principale" />
                        <EditButton label="Modifier"/>
                        <DeleteButton label="Supprimer" mutationMode="optimistic" />
                    </Datagrid>
                </ReferenceManyField>
            </CardContent>
        </Card>
    );
};
