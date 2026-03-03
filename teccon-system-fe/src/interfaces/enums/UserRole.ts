export const UserRole = {
    ADMIN: "ADMIN",
    OPERATOR: "OPERATOR",
    OWNER: "OWNER",
    ENGENIEER: "ENGENIEER",
} as const;

export type UserRole =
    (typeof UserRole)[keyof typeof UserRole];
