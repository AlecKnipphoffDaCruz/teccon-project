import { PressType } from "./enums/PressType";

export interface CapsuleResult {
    id: number;
    sampleId: number;
    curingAgeDays: number;
    failureLoadKgf: number | null;      
    compressiveStrengthMpa: number | null; 
    pressType: PressType | null;
    testedAt: string | null;             
}