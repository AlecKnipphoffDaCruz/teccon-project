import type { LocationDTO } from "./LocationDTO";

export interface Construction {
    id?: number;
    clientId: number;        
    name: string;
    curingAgesExpected: number[];
    quantityExpected: number;
    obs?: string;
    locationDto?: LocationDTO;
}