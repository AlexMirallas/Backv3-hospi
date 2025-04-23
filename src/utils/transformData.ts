import { RaRecord } from 'react-admin';
import { VariantAttributeValueLink } from '../types/types';

export const transformEditVariant = (data: RaRecord): RaRecord => {
    // Create a copy to avoid mutating the original form state directly
    const transformedData = { ...data };

    // Check if attributeValues exists and is an array
    if (Array.isArray(transformedData.attributeValues)) {
        // Map the array to the structure the backend expects
        transformedData.attributeValues = transformedData.attributeValues
            .map((item: VariantAttributeValueLink) => {
                if (!item?.attribute?.id || item?.attributeValue?.id === undefined || item?.attributeValue?.id === null) {
                    console.warn('Skipping transformation for invalid item:', item); 
                    return null;
                }
                return {
                    attributeValueId: item.attributeValue.id,
                    attributeId: item.attribute.id, 
                };
            })
            .filter(item => item !== null); 
    } else {
         transformedData.attributeValues = undefined; 
    }


    console.log('Transformed data being sent:', transformedData);
    return transformedData;
};