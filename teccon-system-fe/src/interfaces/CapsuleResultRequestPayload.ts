export interface CapsuleResultRequestPayload {
    sampleId: number;
    curingAgeDays: number;
    failureLoadKgf: number;
    compressiveStrengthMpa: number;
    pressType: string;
    testedAt: string;
}