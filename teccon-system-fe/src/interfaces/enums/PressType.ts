export const PressType = {
    ELETRIC: "ELETRIC",
    MANUAL: "MANUAL",
} as const;


export type PressType =
    (typeof PressType)[keyof typeof PressType];