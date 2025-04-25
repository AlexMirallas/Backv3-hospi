// src/pages/products/ProductImageList.tsx
import {
    Datagrid,
    ImageField,
    TextField,
    BooleanField,
    NumberField,
    DeleteButton,
    ReferenceManyField,
    useRecordContext,
    useRefresh,
    useNotify,
    useDataProvider,
    Button,
    FunctionField,
    EditButton // Optional: If you want to edit altText/order later
} from 'react-admin';
import { Typography, Card, CardContent } from '@mui/material';
import { ProductImage } from '../../types/types'; // Assuming you have this type defined based on your entity
import { useState } from 'react';

export const ProductImageList = () => {
    const record = useRecordContext(); // Gets the current Product record
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const [updatingPrimary, setUpdatingPrimary] = useState<string | null>(null);

    if (!record) return null;

    // Function to set an image as primary
    const handleSetPrimary = async (imageId: string) => {
        setUpdatingPrimary(imageId);
        try {
            // 1. Set the new image as primary
            await dataProvider.update('images', {
                id: imageId,
                data: { isPrimary: true },
                previousData: {}, // Provide empty previousData or fetch existing if needed by backend
            });

            // 2. Unset other images for this product (optional, depends on backend logic)
            // This might be better handled in a custom backend endpoint
            // Or fetch all other images and update them one by one (less efficient)
            // Example: Fetch others and update
            const { data: otherImages } = await dataProvider.getList('images', {
                filter: { productId: record.id, id: { $ne: imageId }, isPrimary: true }, // Filter for other primary images of this product
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'id', order: 'ASC' },
            });
            for (const img of otherImages) {
                 await dataProvider.update('images', {
                    id: img.id,
                    data: { isPrimary: false },
                    previousData: img,
                 });
            }


            notify('Primary image updated successfully', { type: 'success' });
            refresh();
        } catch (error: any) {
            notify(`Error updating primary image: ${error.message}`, { type: 'error' });
        } finally {
            setUpdatingPrimary(null);
        }
    };


    return (
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Manage Product Images</Typography>
                <ReferenceManyField<ProductImage>
                    label={false} // Hide the default label
                    reference="images" // Your resource name for product images
                    target="productId" // The field in product-images linking to products
                    source="id" // The field in the current product record to match against target
                    sort={{ field: 'displayOrder', order: 'ASC' }}
                    perPage={10}
                >
                    <Datagrid bulkActionButtons={false} optimized>
                        <ImageField
                            source="path" // Use the path field from your entity
                            title="filename"
                            label="Image"
                            sx={{ '& img': { maxWidth: 80, maxHeight: 80, objectFit: 'contain' } }}
                        />
                        <TextField source="altText" label="Alt Text" />
                        <NumberField source="displayOrder" label="Order" />
                        <BooleanField source="isPrimary" label="Primary?" />
                        {/* Button to set as primary */}
                        <FunctionField
                            label="Set Primary"
                            render={(imageRecord: ProductImage) => !imageRecord.isPrimary && (
                                <Button
                                    onClick={() => handleSetPrimary(imageRecord.id.toString())}
                                    size="small"
                                    disabled={updatingPrimary === imageRecord.id}
                                >
                                    {updatingPrimary === imageRecord.id ? 'Setting...' : 'Set Primary'}
                                </Button>
                            )}
                        />
                        {/* Optional: Edit button for metadata */}
                        {/* <EditButton /> */}
                        <DeleteButton mutationMode="pessimistic" />
                    </Datagrid>
                </ReferenceManyField>
            </CardContent>
        </Card>
    );
};