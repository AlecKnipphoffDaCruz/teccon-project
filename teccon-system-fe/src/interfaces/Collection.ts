import type { CastingMethod } from "./enums/CastingMethod";
import type { CollectionStatus } from "./enums/CollectionStatus";
import type { ConcreteType } from "./enums/ConcreteType";
import type { Sample } from "./Sample";

export interface Collection {
    id: number;
    status: CollectionStatus;
    constructionId: number;
    constructionName: string;
    clientId: number;
    curingAgesExpected: number[];   // ← adicionado
    moldingDate: string;
    fckStrength: number;
    concreteType: ConcreteType;
    concreteSupplier: string;
    hasAdditive: boolean;
    additiveType: string;
    castingMethod: CastingMethod;
    totalVolume: number;
    notes: string;
    listSamples: Sample[];
}