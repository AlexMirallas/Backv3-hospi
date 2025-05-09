import { Datagrid, TextField, FunctionField, NumberField, BooleanField, EditButton, usePermissions, useRecordContext, ReferenceManyField,SingleFieldList } from 'react-admin';
import { LinearProgress } from '@mui/material';
import { useListContext } from 'react-admin';
import { ProductVariantRecord, AttributeRecord } from '../../types/types';
import { AttributeValueRecord } from '../../types/types';
import { Identifier } from 'react-admin';
import { useDataProvider, useNotify } from 'react-admin';
import { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { Error } from 'react-admin';
import { CustomCheckIcon } from '../../components/buttons-icons/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/buttons-icons/CustomCrossIcon';
import ApiImageField  from '../../components/imageComponents/ApiImageField';




const renderAttribute = (
    record: ProductVariantRecord | undefined,
    attributeName: string
): string => {
    if (!record?.attributeValues) {
        return 'N/A';
    }
    const attrValueLink = record.attributeValues.find(
        (av: { attributeValue: AttributeValueRecord; attribute: { id: Identifier; name: string } }) => av.attribute?.name === attributeName
    );
    return attrValueLink?.attributeValue?.value ?? 'N/A';
};


const DynamicVariantDatagrid: React.FC<{ attributeTypes: AttributeRecord[] }> = ({ attributeTypes }) => {

    const { isLoading: variantsLoading } = useListContext<ProductVariantRecord>();

    if (variantsLoading) {
        return <LinearProgress />;
    }

    return (
        <Datagrid
            bulkActionButtons={false} 
            rowClick="edit"
            optimized 
            sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
               
            }}
        >   
        <ReferenceManyField
                    label="Primary Image"
                    reference="images" 
                    target="variantId" 
                    source="id" 
                    filter={{ isPrimary: true }} 
                    sortable={false}
                    perPage={1} 
            >
                <SingleFieldList linkType={false}>
                    <ApiImageField
                        source="path"
                        title="filename"
                        sx={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
                    />
                </SingleFieldList>
            </ReferenceManyField>
            <TextField source="sku" sortable={false} />

            {attributeTypes.map(attrType => (
                <FunctionField<ProductVariantRecord>
                    key={attrType.id}
                    label={attrType.name}
                    render={record => renderAttribute(record, attrType.name)}
                    textAlign="left" 
                    sortable={true}
                />
            ))}

            <NumberField source="priceAdjustment" options={{ style: 'currency', currency: 'EUR' }} sortable={false} />
            <NumberField source="currentStock" label="Stock actuel" options={
                { style: 'decimal', minimumFractionDigits: 0 } } emptyText='N/A'
            />
            <BooleanField source="isActive" sortable={true} TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />
            <EditButton />
        </Datagrid>
    );
};

export const VariantsListWithDynamicAttributes: React.FC = () => {
    
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const {permissions} = usePermissions();
    const productRecord =  useRecordContext<ProductVariantRecord>();

    const [attributeTypes, setAttributeTypes] = useState<AttributeRecord[] | null>(null);
    const [loadingAttributes, setLoadingAttributes] = useState<boolean>(true);
    const [attributeError, setAttributeError] = useState<Error | null>(null);

    const clientId = productRecord?.clientId;
    const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');

    useEffect(() => {
        setLoadingAttributes(true);
        
        const filter = {
            ...(clientId && isSuperAdmin ? { clientId } : {}),
        }

        dataProvider.getList<AttributeRecord>('attributes', {
            pagination: { page: 1, perPage: 100 }, 
            sort: { field: 'position', order: 'ASC' },
            filter: filter,
        })
        .then(({ data }) => {
            setAttributeTypes(data);
            setLoadingAttributes(false);
        })
        .catch(error => {
            console.error("Error fetching attribute types:", error);
            setAttributeError(error);
            setLoadingAttributes(false);
            notify('Error loading attribute definitions', { type: 'warning' }); 
        });
    }, [dataProvider, notify]);

if (loadingAttributes) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <CircularProgress size={24} />
                <Box ml={1}><Typography variant="body2">Loading attribute columns...</Typography></Box>
            </Box>
        );
    }

    
    if (attributeError || !attributeTypes) {
        return (
            <Error
                error={`Failed to load attribute columns: ${attributeError?.message || 'Unknown error'}`}
                resetErrorBoundary={() => window.location.reload()}
            />
        );
    }

    return <DynamicVariantDatagrid attributeTypes={attributeTypes} />;
};