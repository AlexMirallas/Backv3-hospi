import React from 'react';
import { useMediaQuery, Theme } from '@mui/material';
import { useRecordContext,EditButton } from 'react-admin';
import { ReferenceManyField, Datagrid, TextField, FunctionField, NumberField, BooleanField, SimpleList } from 'react-admin';
import { ProductVariantRecord } from '../../types/types';





export const ExistingVariantsList: React.FC = () => {
    const record = useRecordContext(); // Get the current product record
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

    if (!record) return null;

    return (
        <ReferenceManyField<ProductVariantRecord>
            label="Existing Variants"
            reference="variants"  
            target="productId" // filters by 'productId'
            source="id"       // *current* record (Product) to use for filtering
            perPage={25}
        >
           {/* Use SimpleList on small screens, Datagrid on larger screens */}
           {isSmall ? (
                <SimpleList
                    primaryText={record => record.sku}
                    secondaryText={record => `Stock: ${record.stockQuantity ?? 0}`}
                    tertiaryText={record => `Active: ${record.isActive}`}
                />
            ) : (
                <Datagrid rowClick="edit"> {/* Make rows clickable to edit variant */}
                    <TextField source="sku" />
                    <FunctionField<ProductVariantRecord>
                        label="Attributes"
                        render={record => record?.attributeValues
                            ?.map(pav => `${pav.attribute?.name}: ${pav.attributeValue?.value}`)
                            .join(', ') ?? 'N/A'
                        }
                        sortBy="attributeValues" 
                    />
                    <NumberField source="priceAdjustment" options={{ style: 'currency', currency: 'EUR' }} /> {/* Adjust currency */}
                    <NumberField source="stockQuantity" />
                    <BooleanField source="isActive" />
                    <EditButton /> 
                </Datagrid>
            )}
        </ReferenceManyField>
    );
};