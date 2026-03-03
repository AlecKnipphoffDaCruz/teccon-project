export const CollectionStatus = {
    DRAFT: "DRAFT",
    IN_ANALYSIS: "IN_ANALYSIS",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    FINISHED: "FINISHED",
} as const;

export type CollectionStatus =
    (typeof CollectionStatus)[keyof typeof CollectionStatus];