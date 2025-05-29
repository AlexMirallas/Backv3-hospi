import {
    Datagrid,
    TextField,
    BooleanField,
    NumberField,
    DeleteButton,
    ReferenceManyField,
    useRecordContext,
    EditButton,
    useRefresh,
    useNotify,
} from 'react-admin';
import { Typography, Card, CardContent } from '@mui/material';
import { ProductImage } from '../../types/types';
import ApiImageField from './ApiImageField'; 

export const ProductImageList = () => {
    const record = useRecordContext();
    const refresh= useRefresh();
    const notify = useNotify();

    if (!record) return null;

    const handleDeleteSuccess = () => {
        notify('Image deleted successfully', { type: 'info' }); 
        refresh(); 
    };

    const handleDeleteError = (error: any) => {
        notify(`Error: ${error.message || 'Could not delete image'}`, { type: 'warning' });
    };

    return (
        <Card sx={{ marginTop: 2, width: '80%', alignSelf: 'left' }} >
            <CardContent>
                <Typography variant="h6" gutterBottom>Gérer les images du produit</Typography>
                <ReferenceManyField<ProductImage>
                    label={false}
                    reference="images"
                    target="productId"
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
                        <EditButton label="Modifier" />
                        <DeleteButton 
                            mutationMode="optimistic" 
                            label="Supprimer"
                            mutationOptions={{
                                onSuccess: handleDeleteSuccess,
                                onError: handleDeleteError,
                            }}
                        />
                    </Datagrid>
                </ReferenceManyField>
            </CardContent>
        </Card>
    );
};
