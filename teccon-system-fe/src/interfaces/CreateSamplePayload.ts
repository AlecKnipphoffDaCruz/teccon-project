export interface CreateSamplePayload {
  collectionId: number;
  serialNumber: string;
  capsuleCount: number;
  invoiceNumber?: number;
  sealNumber?: number;
  loadTime: string; // ISO string
  moldingTime: string; 
  slumpTest?: number;
  extraWaterAdded?: number;
  volume?: number;
  concreteArea?: string;
}