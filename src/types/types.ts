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
    
    attributeValues?: Array<{
        attributeValue: AttributeValueRecord;
        attribute: { id: Identifier; name: string };
    }>;
}

export interface AttributeRecord extends RaRecord {
    id: Identifier;
    name: string;  
}

export interface AttributeValueItem extends RaRecord {
    attributeId: Identifier;
    attributeValueId: Identifier;
}

export interface VariantAttributeValueLink extends RaRecord {
    id: Identifier; 
    attribute: {
        id: Identifier;
        name: string;
       
    };
    attributeValue: {
        id: Identifier; 
        value: string;
        attributeId: Identifier; 
       
    };
    
}

export interface CustomJwtPayload {
    email: string;
    sub: string;
    roles: string[];
    clientId: string;
    iat: number;
    exp: number;
}