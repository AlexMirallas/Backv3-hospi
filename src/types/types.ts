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
    // Inherits id from RaRecord (which is Identifier: string | number)
    filename: string;
    path: string; // This will likely be the URL path to the image
    originalFilename?: string;
    mimetype?: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
    productId?: Identifier; // Foreign key to Product (optional if variantId is present)
    variantId?: Identifier; // Foreign key to ProductVariant (optional if productId is present)
    clientId: Identifier; // Foreign key to Client
    createdAt: Date | string; // Use string if your API returns dates as ISO strings
    updatedAt: Date | string; // Use string if your API returns dates as ISO strings
}


