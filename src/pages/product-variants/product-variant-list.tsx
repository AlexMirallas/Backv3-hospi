import { useMediaQuery, Theme } from '@mui/material';
import { useRecordContext, usePermissions } from 'react-admin';
import { ReferenceManyField, SimpleList } from 'react-admin';
import { ProductVariantRecord } from '../../types/types';
import { VariantsListWithDynamicAttributes } from './VariantsListWithDynamicAttributes';








export const ExistingVariantsList: React.FC = () => {
    const record = useRecordContext(); 
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const {permissions} = usePermissions();

    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    if (!record) return null;

    return (
        <ReferenceManyField<ProductVariantRecord>
            label="Existing Variants"
            reference="variants"  
            target="productId" 
            source="id"       
            perPage={10}
            filter={(isSuperAdmin ? { clientId: record.clientId } : { })}
        >
           
           {isSmall ? (
                <SimpleList
                    primaryText={record => record.sku}
                    secondaryText={record => `Stock: ${record.stockQuantity ?? 0}`}
                    tertiaryText={record => `Active: ${record.isActive}`}
                />
            ) : (
                <VariantsListWithDynamicAttributes />
            )}
        </ReferenceManyField>
    );
};