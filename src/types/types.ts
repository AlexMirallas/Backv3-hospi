import { RaRecord } from 'react-admin';
import { Identifier } from 'react-admin';


export interface AttributeValueRecord extends RaRecord {
    id: Identifier;
    value: string;
    attribute?: {
        id: Identifier;
        name: string;
    };
}

export interface ProductVariantRecord extends RaRecord {
    id: Identifier;
    sku: string;
    priceAdjustment?: number;
    stockQuantity?: number;
    isActive?: boolean;
    // Crucially, expect attributeValues to be populated for display
    attributeValues?: Array<{
        attributeValue: AttributeValueRecord;
        attribute: { id: Identifier; name: string };
    }>;
}

export interface AttributeRecord extends RaRecord {
    id: Identifier;
    name: string;
    // Add other fields if needed
}