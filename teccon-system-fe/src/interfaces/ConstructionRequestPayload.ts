export interface ConstructionRequestPayload {
    clientId: number;
    location: {
        id?: number | null;
        state: string;
        city: string;
        neighborhood: string;
        street: string;
        number: number;
    };
    name: string;
    curingAgesExpected: number[];
    quantityExpected: number;
    obs?: string;
}