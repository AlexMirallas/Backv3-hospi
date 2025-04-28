import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    useRecordContext,
    TopToolbar,
    BooleanInput,
    
} from 'react-admin';
import { Card, CardContent, Typography, Box, IconButton,useMediaQuery,useTheme, Dialog, DialogTitle,DialogContent  } from '@mui/material';
import { ProductImage } from '../../types/types';
import { useNavigate } from 'react-router';
import ApiImageField from './ApiImageField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const ImageEditActions = () => {
    const navigate = useNavigate();
    return(
    <TopToolbar>
        <IconButton onClick={() => navigate(-1)} aria-label="Go back" size="small">
                <ArrowBackIcon />
        </IconButton>
    </TopToolbar>
)};

const ImagePreview = () => {
    const record = useRecordContext<ProductImage>();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!record) return null;

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const imagePath = record.path;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const fullUrl = imagePath?.startsWith('http')
        ? imagePath
        : `${baseUrl.replace(/\/$/, '')}/${imagePath?.replace(/^\//, '')}`;
    return (
        <>
        <Box mb={2} onClick={handleOpen} sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ApiImageField
                source="path"
                title="filename"
                sx={{ maxHeight: 300, maxWidth: '100%', objectFit: 'contain' }}
            />
        </Box>
        <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullscreen}
        maxWidth="lg" 
        aria-labelledby="image-preview-dialog-title"
    >
        <DialogTitle id="image-preview-dialog-title" sx={{ m: 0, p: 2 }}>
            {record.altText || record.filename || 'Image Preview'}
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {fullUrl ? (
                <img
                    src={fullUrl}
                    alt={record.altText || 'Full size preview'}
                    style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
            ) : (
                <Typography>Image not available</Typography>
            )}
        </DialogContent>
    </Dialog>
    </>
    );
};

export const ImageEdit = (props: any) => {
    return(
    <Edit {...props} title="Edit Image Details" actions={<ImageEditActions />} redirect='products'>
        <SimpleForm>
            <Typography variant="h5" gutterBottom>Edit Image Metadata</Typography>
            <Card sx={{ padding: 2, marginBottom: 2 }}>
                <CardContent>
                    <ImagePreview />
                    <TextInput source="filename" disabled fullWidth label="Stored Filename" />
                    <TextInput source="originalFilename" disabled fullWidth label="Original Filename" />
                    <TextInput source="altText" fullWidth label="Alt Text (for accessibility)"  />
                    <NumberInput source="displayOrder" fullWidth label="Display Order" />
                    <BooleanInput source="isPrimary" fullWidth label="Is Primary Image?" />
                </CardContent>
            </Card>
        </SimpleForm>
    </Edit>
)};

export default ImageEdit;