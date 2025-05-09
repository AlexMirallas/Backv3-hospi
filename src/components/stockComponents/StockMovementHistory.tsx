import React from 'react';
import {
    ReferenceManyField,
    Datagrid,
    DateField,
    TextField,
    NumberField,
    ChipField,
    Pagination,
    ReferenceField,
    Identifier,
} from 'react-admin';
import { Typography } from '@mui/material';

interface StockMovementHistoryProps {
    targetId: Identifier; // Product ID or Variant ID
    targetType: 'productId' | 'variantId'; // To filter movements correctly
    resourceName: string; // e.g., "Product" or "Variant SKU" for title
}

export const StockMovementHistory: React.FC<StockMovementHistoryProps> = ({
    targetId,
    targetType,
    resourceName,
}) => {
    return (
        <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Movement History for {resourceName}
            </Typography>
            <ReferenceManyField
                label={false}
                reference="stock-movements"
                target={targetType} // 'productId' or 'variantId'
                filter={{ [targetType]: targetId }} // Dynamic filter based on targetType
                source="id" // This should be the ID of the parent (product/variant)
                sort={{ field: 'movementDate', order: 'DESC' }}
                pagination={<Pagination rowsPerPageOptions={[5]} />}
                perPage={5}
            >
                <Datagrid bulkActionButtons={false} optimized size="small">
                    <DateField source="movementDate" label="Date" showTime />
                    <ChipField source="movementType" label="Type" />
                    <NumberField source="quantityChange" label="Change" options={{ signDisplay: 'always' }} />
                    <TextField source="reason" label="Reason" />
                    <ReferenceField source="userId" reference="users" link={false} label="User">
                        <TextField source="fullName" /> {/* Adjust if your user record has a different name field */}
                    </ReferenceField>
                    {/* <TextField source="sourceDocumentId" label="Doc ID" /> */}
                </Datagrid>
            </ReferenceManyField>
        </>
    );
};