import React from 'react';
import { useMediaQuery, Theme } from '@mui/material';
import { useRecordContext,EditButton } from 'react-admin';
import { ReferenceManyField, Datagrid, TextField, FunctionField, NumberField, BooleanField, SimpleList } from 'react-admin';
import { ProductVariantRecord } from '../../types/types';





export const ExistingVariantsList: React.FC = () => {
    const record = useRecordContext(); 
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

    if (!record) return null;

    return (
        <ReferenceManyField<ProductVariantRecord>
            label="Existing Variants"
            reference="variants"  
            target="productId" 
            source="id"       
            perPage={25}
        >
           
           {isSmall ? (
                <SimpleList
                    primaryText={record => record.sku}
                    secondaryText={record => `Stock: ${record.stockQuantity ?? 0}`}
                    tertiaryText={record => `Active: ${record.isActive}`}
                />
            ) : (
                <Datagrid rowClick="edit" sx={{
                    '& .RaDatagrid-rowOdd': {
                        backgroundColor: '#f0f0f0',
                    },
                }}>
                    <TextField source="sku" />
                    <FunctionField<ProductVariantRecord>
                        label="Attributes"
                        render={record => record?.attributeValues
                            ?.map(pav => `${pav.attribute?.name}: ${pav.attributeValue?.value}`)
                            .join(', ') ?? 'N/A'
                        }
                        sortBy="position" 
                    />
                    <NumberField source="priceAdjustment" options={{ style: 'currency', currency: 'EUR' }} /> 
                    <NumberField source="stockQuantity" />
                    <BooleanField source="isActive" />
                    <EditButton /> 
                </Datagrid>
            )}
        </ReferenceManyField>
    );
};