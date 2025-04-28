import { RaRecord } from 'react-admin';
import { Identifier } from 'react-admin';


export interface AttributeValueRecord extends RaRecord {
    id: number;
    value: string;
    attribute?: {
        id: number;
        name: string;
    };
}

export interface ProductVariantRecord extends RaRecord {
    id: Identifier;
    sku: string;
    priceAdjustment?: number;
    stockQuantity?: number;
    isActive?: boolean;
    images?:ProductImage[];
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
    sub: string; 
    email: string;
    firstName: string;
    roles: string[]; 
    lastName: string;
    clientId: string;
    exp: number;
    iat: number;
}

export interface ProductImage extends RaRecord {
    filename: string;
    path: string;
    originalFilename?: string;
    mimetype?: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
    productId?: Identifier; 
    variantId?: Identifier; 
    clientId: Identifier; 
    createdAt: Date | string; 
    updatedAt: Date | string; 
}

export interface ApiImageFieldProps {
    source: string;
    label?: string; 
    title?: string; 
    sx?: object;
}


