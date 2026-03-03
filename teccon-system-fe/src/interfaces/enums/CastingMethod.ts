export const CastingMethod = {
    PUMPED: "PUMPED",
    CONVENTIONAL: "CONVENTIONAL",
} as const;

export type CastingMethod =
    (typeof CastingMethod)[keyof typeof CastingMethod];