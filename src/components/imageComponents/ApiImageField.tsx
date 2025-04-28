import { useRecordContext } from 'react-admin';
import { Box } from '@mui/material';
import { ProductImage } from '../../types/types'; 
import { ApiImageFieldProps } from '../../types/types';

const ApiImageField = ({ source, title }: ApiImageFieldProps) => {
    const record = useRecordContext<ProductImage>();
    if (!record) return null;

    const imagePath = record[source];
    if (!imagePath) return null;

    const baseUrl = import.meta.env.VITE_API_URL || '';

    const fullUrl = imagePath.startsWith('http')
        ? imagePath 
        : `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;

    const imageTitle = title && record[title] ? record[title] : '';

    return (
        <Box component="img"
            src={fullUrl}
            title={imageTitle}
            alt={record.altText || imageTitle}
            sx={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.style.display = 'none';
                console.error("Failed to load image:", fullUrl);
            }}
        />
    );
};

export default ApiImageField;