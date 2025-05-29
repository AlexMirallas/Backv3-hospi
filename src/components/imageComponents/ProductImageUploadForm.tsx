import { useState, useRef } from 'react';
import {
    useNotify,
    useRefresh,
    useRecordContext,
    fetchUtils,
    useGetIdentity,
} from 'react-admin';
import {
    Button,
    CircularProgress,
    Stack,
    Typography,
    Card,
    CardContent,
    TextField,
    Checkbox,
    FormControlLabel,
    Input,
    Box,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export const ProductImageUploadForm = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const productRecord = useRecordContext();
    const { identity } = useGetIdentity();

    const [file, setFile] = useState<File | null>(null);
    const [altText, setAltText] = useState('');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [isPrimary, setIsPrimary] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!productRecord || !identity) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSelectFileClick = () => {
        fileInputRef.current?.click();
    };

    const resetForm = () => {
        setFile(null);
        setPreviewUrl(null);
        setAltText('');
        setDisplayOrder('0');
        setIsPrimary(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            notify('Please select an image file to upload.', { type: 'warning' });
            return;
        }
        setUploading(true);
        const fileToUpload = file;
        const formData = new FormData();
        const order = parseInt(displayOrder, 10);

        formData.append('image', fileToUpload);
        formData.append('altText', altText);
        formData.append('displayOrder', (Number.isNaN(order) ? 0 : order).toString());
        formData.append('isPrimary', String(isPrimary));
        formData.append('productId', productRecord.id.toString());
        const clientIdToSend = productRecord.clientId;
        console.log("Client ID to send:", clientIdToSend);
        if (!clientIdToSend) {
             notify('Client ID is missing, cannot upload image.', { type: 'error' });
             setUploading(false);
             return;
        }
        formData.append('clientId', clientIdToSend.toString());

        const apiUrl = `${import.meta.env.VITE_API_URL || ''}/images/product/${productRecord.id}`;
        const token = localStorage.getItem('token');
        const httpClient = fetchUtils.fetchJson;

        try {
            await httpClient(apiUrl, {
                method: 'POST',
                body: formData,
                headers: token ? new Headers({ Authorization: `Bearer ${token}` }) : new Headers(),
            });
            notify('Image uploaded successfully!', { type: 'success' });
            refresh();
            resetForm();
        } catch (error: any) {
            console.error("Upload failed:", error);
            const errorMessage = error.body?.message || error.message || 'Unknown error';
            notify(`Error uploading image: ${errorMessage}`, { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card sx={{ marginTop: 2, width: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Ajouter une nouvelle image</Typography>
                <Stack spacing={2}>
                    <Input
                        type="file"
                        inputProps={{ accept: 'image/*' }}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        inputRef={fileInputRef}
                    />

                    <Button
                        variant="outlined"
                        onClick={handleSelectFileClick}
                        startIcon={<AddPhotoAlternateIcon />}
                    >
                        Sélectionner une image
                    </Button>

                    {previewUrl && (
                        <Box sx={{ textAlign: 'center', my: 1 }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                    {file && <Typography variant="body2">Selected: {file.name}</Typography>}

                    <TextField
                        label="Alt Text*"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        fullWidth
                        variant="filled"
                        size="small"
                    />
                    <TextField
                        label="Ordre d'affichage"
                        helperText="Position de l'image dans la liste"
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(e.target.value)}
                        fullWidth
                        variant="filled"
                        size="small"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                            />
                        }
                        label="Définir comme image principale"
                    />

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={uploading || !file}
                        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    >
                        {uploading ? 'Uploading...' : 'Télécharger l\'image'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};











