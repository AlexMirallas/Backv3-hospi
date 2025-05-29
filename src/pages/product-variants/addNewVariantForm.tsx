import { useState, useEffect } from 'react';
import {
    useDataProvider,
    useNotify,
    useRefresh,
    useRecordContext,
    useGetList,
    fetchUtils,
    useGetIdentity,
} from 'react-admin';
import {
    Box,
    Grid,
    CircularProgress,
    Alert,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Autocomplete,
} from '@mui/material';
import { AttributeRecord, AttributeValueRecord } from '../../types/types';

export const AddNewVariantForm: React.FC = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const productRecord = useRecordContext();
    const { identity } = useGetIdentity();


    const [sku, setSku] = useState('');
    const [priceAdjustment, setPriceAdjustment] = useState(0);
    const [initialStock, setInitialStock] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: number]: string | number | null }>({});
    const [attributeValuesByAttribute, setAttributeValuesByAttribute] = useState<{ [key: number]: AttributeValueRecord[] }>({});
    const [variantImageFile, setVariantImageFile] = useState<File | null>(null);
    const [variantImagePreview, setVariantImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const clientId = productRecord?.clientId;
    const { data: attributes, isLoading: attributesLoading, error: attributesError } = useGetList<AttributeRecord>(
        'attributes',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'position', order: 'ASC' },
            filter: { ...(clientId ? { clientId } : {}) }
        }
    );
    
   
    useEffect(() => {
        if (!attributes || attributes.length === 0 || !clientId) return;
        
        const initialSelectedAttributes: { [key: string]: string | number | null } = {};
        attributes.forEach(attr => {
            initialSelectedAttributes[attr.id] = null;
        });
        setSelectedAttributes(initialSelectedAttributes);
        
        const fetchAttributeValues = async () => {
            const valuesByAttribute: { [key: string]: AttributeValueRecord[] } = {};
            
            for (const attribute of attributes) {
                try {
                    const { data } = await dataProvider.getList<AttributeValueRecord>('attribute-values', {
                        pagination: { page: 1, perPage: 500 },
                        sort: { field: 'position', order: 'ASC' },
                        filter: { 
                            attributeId: attribute.id,
                            ...(clientId ? { clientId } : {})
                        }
                    });
                    valuesByAttribute[attribute.id] = data;
                } catch (error) {
                    console.error(`Error fetching values for attribute ${attribute.id}:`, error);
                    valuesByAttribute[attribute.id] = [];
                }
            }
            
            setAttributeValuesByAttribute(valuesByAttribute);
        };
        
        fetchAttributeValues();
    }, [attributes, clientId, dataProvider]);

    
    const handleAttributeChange = (attributeId: string, value: AttributeValueRecord | null) => {
        setSelectedAttributes(prev => ({ 
            ...prev, 
            [attributeId]: value?.id || null 
        }));
    };

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVariantImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVariantImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setVariantImageFile(null);
            setVariantImagePreview(null);
        }
    };

    const validateForm = (): boolean => {
        
        setFormError(null);
        
        if (!sku.trim()) {
            setFormError('SKU is required');
            return false;
        }
        
        const missingAttributes = attributes?.filter(attr => 
            attr.required && !selectedAttributes[attr.id as number]
        );
        
        if (missingAttributes && missingAttributes.length > 0) {
            const missingNames = missingAttributes.map(attr => attr.name).join(', ');
            setFormError(`Please select values for required attributes: ${missingNames}`);
            return false;
        }
        
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        try {
            
            let imageUrl: string | null = null;
            if (variantImageFile) {
                const formData = new FormData();
                formData.append('file', variantImageFile);
                formData.append('clientId', productRecord?.clientId || identity?.clientId || '');
                formData.append('entityType', 'variant'); 

               
                const apiUrl = `${import.meta.env.VITE_API_URL || ''}/product-images/upload`;
                const token = localStorage.getItem('token');
                
                try {
                    const { json } = await fetchUtils.fetchJson(apiUrl, {
                        method: 'POST',
                        body: formData,
                        headers: token ? new Headers({ Authorization: `Bearer ${token}` }) : new Headers(),
                    });
                    
                   
                    imageUrl = json.path || json.url || null;
                } catch (error: any) {
                    notify(`Image upload failed: ${error.message}`, { type: 'error' });
                    setIsSubmitting(false);
                    return;
                }
            }

          
            
            const attributeValues = Object.entries(selectedAttributes)
                .filter(([attributeId, valueId]) => valueId !== null)
                .map(([attributeId, valueId]) => ({
                    attributeId : attributeId,
                    attributeValueId: valueId,
                }));

            
            const variantData = {
                productId: productRecord?.id,
                sku,
                priceAdjustment,
                isActive,
                clientId: productRecord?.clientId || identity?.clientId,
                attributeValues: attributeValues, 
                ...(imageUrl && { image: imageUrl }) 
            };

            
            await dataProvider.create('variants', { data: variantData });
            
            
            notify('Variant created successfully', { type: 'success' });
            refresh(); 
            
           
            setSku('');
            setPriceAdjustment(0);
            setInitialStock(0);
            setIsActive(true);
            
          
            const resetAttributes: { [key: string]: string | null } = {};
            attributes?.forEach(attr => {
                resetAttributes[attr.id] = null;
            });
            setSelectedAttributes(resetAttributes);
            
            setVariantImageFile(null);
            setVariantImagePreview(null);
            
        } catch (error: any) {
            notify(`Error creating variant: ${error.message}`, { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    
    if (attributesLoading) return <CircularProgress />;
    if (attributesError) return <Alert severity="error">Error loading attributes.</Alert>;
    if (!attributes) return null;

    return (
        <Box sx={{ mt: 2, width: '100%' }}>
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
            )}
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        name="sku"
                        label="SKU de la variante"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        fullWidth
                        size="small"
                        error={formError?.includes('SKU')}
                        helperText="SKU unique pour cette variante"
                    />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        label="Ajustement de prix"
                        type="number"
                        value={priceAdjustment}
                        onChange={(e) => setPriceAdjustment(parseFloat(e.target.value) || 0)}
                        fullWidth
                        size="small"
                        InputProps={{
                            inputProps: { step: "0.01" }
                        }}
                        helperText="Ajouter un ajustement de prix à la variante"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center',mb: 3, ml:3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={isActive} 
                                onChange={(e) => setIsActive(e.target.checked)} 
                            />
                        }
                        label="Est actif"
                    />
                </Grid>

            
                

                {/* Attribute value selectors */}
                {attributes.map((attribute: AttributeRecord) => {
                    const attributeValues = attributeValuesByAttribute[attribute.id as number] || [];
                    const selectedValue = selectedAttributes[attribute.id as number] 
                        ? attributeValues.find(av => av.id === selectedAttributes[attribute.id as number])
                        : null;
                        
                    return (
                        <Grid item xs={12} sm={6} md={4} key={attribute.id}>
                            <Autocomplete
                                options={attributeValues}
                                getOptionLabel={(option: AttributeValueRecord) => option.value}
                                value={selectedValue}
                                onChange={(_, newValue) => handleAttributeChange(String(attribute.id), newValue)}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={attribute.name}
                                        size="small"
                                        error={formError?.includes(attribute.name)}
                                    />
                                )}
                                loading={!attributeValuesByAttribute[attribute.id as number]}
                                loadingText="Loading values..."
                                noOptionsText="No values available"
                            />
                        </Grid>
                    );
                })}

                {/* Submit button */}
                <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Variant'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddNewVariantForm;