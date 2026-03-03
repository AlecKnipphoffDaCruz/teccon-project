import type { Client } from "./Client";
import type { UserRole } from "./enums/UserRole";

export interface User {
    id: string;
    name: string;
    contact: string; //email or phone
    login: string;
    password: string;
    role: UserRole;
    client: Client;
    isActive: boolean;
}