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
                // Basic check to ensure the nested structure exists
                if (!item?.attribute?.id || item?.attributeValue?.id === undefined || item?.attributeValue?.id === null) {
                    console.warn('Skipping transformation for invalid item:', item);
                    // Return null or an empty object, or throw an error,
                    // depending on how you want to handle invalid items from the form state.
                    // Returning null might be safest if filtering later.
                    return null;
                }
                // Return the object matching VariantAttributeValueUpdateDto
                return {
                    attributeValueId: item.attributeValue.id,
                    attributeId: item.attribute.id, 
                };
            })
            .filter(item => item !== null); // Filter out any items that couldn't be transformed
    } else {
        // If attributeValues is not an array or doesn't exist,
        // ensure it's not sent or sent as empty array if backend allows/requires
         transformedData.attributeValues = undefined; // Or [] depending on DTO/backend logic
    }


    console.log('Transformed data being sent:', transformedData); // Debug log
    return transformedData;
};