export interface CollectionRequestPayload {
    status: string;
    constructionId: number;
    clientId: number;
    moldingDate?: string;
    fckStrength?: number;
    concreteType?: string;
    concreteSupplier?: string;
    hasAdditive?: boolean;
    additiveType?: string;
    castingMethod?: string;
    totalVolume?: number;
    notes?: string;
}