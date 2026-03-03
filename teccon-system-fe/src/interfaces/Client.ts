import type {Construction} from "./Construction";

export interface Client {
    id: number;
    name: string;
    contact: string; // email or phone
    listConstructions: Construction[];
    isActive: boolean;
}

