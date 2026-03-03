export const ConcreteType = {
    READY_MIX: "READY_MIX",
    SITE_MIX: "SITE_MIX",
} as const;

export type ConcreteType =
    (typeof ConcreteType)[keyof typeof ConcreteType];