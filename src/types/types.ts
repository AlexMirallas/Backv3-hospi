import { RaRecord } from 'react-admin';
import { Identifier } from 'react-admin';
import { statusChoices } from '../enums/enums';



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
    isActive?: boolean;
    images?:ProductImage[];
    attributeValues?: Array<{
        attributeValue: AttributeValueRecord;
        attribute: { id: Identifier; name: string };
    }>;
    product?: ProductRecord;
    productId?: Identifier;
    clientId: Identifier;
    client?: Client;
    currentStock?: number;
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

export interface StockLevelRecord extends RaRecord {
    id: string;
    productId?: string;
    product?: ProductRecord; 
    variantId?: string;
    variant?: ProductVariantRecord;
    quantity: number;
    clientId: string;
    client?: Client; 
    updatedAt: Date;
}

export interface Client extends RaRecord {
    id: Identifier;
    name: string;
    subdomain: string;
    status: typeof statusChoices;
    settings: Array<any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductRecord extends RaRecord {
    id: Identifier;
    name: string;
    description?: string;
    sku?: string;
    price?: number;
    currentStock?: number;
    variants?: ProductVariantRecord[];
    images?: ProductImage[];
    clientId: Identifier;
    client?: Client;
    createdAt: Date;
    updatedAt: Date;
}

export enum StockMovementType {
    DELIVERY = 'delivery', 
    SALE = 'sale', 
    ADJUSTMENT_IN = 'adjustment_in', 
    ADJUSTMENT_OUT = 'adjustment_out', 
    INITIAL = 'initial', 
    RETURN = 'return', 
  }

  export interface StockMovementRecord extends RaRecord {
    id: string;
    productId?: string;
    product?: ProductRecord;
    variantId?: string;
    variant?: ProductVariantRecord;
    quantityChange: number;
    movementType: StockMovementType;
    reason?: string;
    sourceDocumentId?: string; 
    sourceDocumentType?: string; 
    userId?: string;
    clientId: string;
    client?: Client;
    movementDate: Date;
}


