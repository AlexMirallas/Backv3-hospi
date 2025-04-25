import { useState } from 'react';
import {
    useNotify,
    useRefresh,
    useRecordContext,
    ImageInput,
    ImageField,
    TextInput,
    NumberInput,
    BooleanInput,
    fetchUtils,
    useGetIdentity, 
} from 'react-admin';
import { Button, CircularProgress, Stack, Typography, Card, CardContent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ProductImageUploadForm = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const productRecord = useRecordContext(); // Get the current product record
    const { identity } = useGetIdentity(); // Get user identity if needed for clientId

    const [files, setFiles] = useState<any[]>([]); // Store selected files from ImageInput
    const [altText, setAltText] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isPrimary, setIsPrimary] = useState(false);
    const [uploading, setUploading] = useState(false);

    if (!productRecord || !identity) return null; // Ensure product context and identity are available

    const handleFileChange = (acceptedFiles: any) => {
        // ImageInput gives an array of file objects with preview data
        setFiles(acceptedFiles || []);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (files.length === 0) {
            notify('Please select an image file to upload.', { type: 'warning' });
            return;
        }

        setUploading(true);

        const fileToUpload = files[0]; // Handle single file upload for simplicity here
        if (!fileToUpload || !fileToUpload.rawFile) {
             notify('Invalid file selected.', { type: 'error' });
             setUploading(false);
             return;
        }


        const formData = new FormData();
        formData.append('file', fileToUpload.rawFile); // 'file' should match your NestJS @UploadedFile('file') parameter
        formData.append('productId', productRecord.id.toString());
        formData.append('clientId', productRecord.clientId || identity.clientId); // Use product's clientId or user's
        formData.append('altText', altText);
        formData.append('displayOrder', displayOrder.toString());
        formData.append('isPrimary', String(isPrimary));

        // Replace with your actual API URL and auth logic
        const apiUrl = `${import.meta.env.VITE_API_URL || ''}/images`; // Your dedicated upload endpoint
        const token = localStorage.getItem('token'); // Or however you store your token
        const httpClient = fetchUtils.fetchJson;

        try {
            await httpClient(apiUrl, {
                method: 'POST',
                body: formData,
                headers: token ? new Headers({ Authorization: `Bearer ${token}` }) : new Headers(),
                // Note: Don't set Content-Type, the browser does it correctly for FormData
            });

            notify('Image uploaded successfully!', { type: 'success' });
            refresh(); // Refresh the ProductEdit page (which includes ProductImageList)
            // Reset form
            setFiles([]);
            setAltText('');
            setDisplayOrder(0);
            setIsPrimary(false);
        } catch (error: any) {
            console.error("Upload failed:", error);
            notify(`Error uploading image: ${error.message || 'Unknown error'}`, { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Upload New Image</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <ImageInput
                            source="files" // Temporary source for the input
                            label="Select Image"
                            accept={{"image/*": []}} // Accept all image types
                            multiple={false} // Simplified to single upload for this form
                            onChange={handleFileChange} // Use onChange to capture files
                            isRequired // Make sure a file is selected
                        >
                            <ImageField source="src" title="title" sx={{ '& img': { maxWidth: 150, maxHeight: 150 } }} />
                        </ImageInput>

                        <TextInput
                            source="altText" // Temporary source
                            label="Alt Text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            fullWidth
                        />
                        <NumberInput
                            source="displayOrder" // Temporary source
                            label="Display Order"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                            fullWidth
                        />
                        <BooleanInput
                            source="isPrimary" // Temporary source
                            label="Set as Primary Image?"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={uploading || files.length === 0}
                            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};