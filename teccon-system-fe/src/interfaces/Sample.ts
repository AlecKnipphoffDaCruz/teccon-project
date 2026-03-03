import type { CapsuleResult } from "./CapsuleResult";

export interface Sample {
    id: number;
    collectionId: number;       
    serialNumber: string;
    capsuleCount: number;
    invoiceNumber: number | null;
    sealNumber: number | null;
    loadTime: string;           
    moldingTime: string;
    slumpTest: number | null;
    extraWaterAdded: number | null;
    volume: number | null;
    concreteArea: string | null;
    capsulesResults: CapsuleResult[];
}