// ===== Create Silhouette DTO =====
export interface CreateSilhouetteDto {
    contentUrl: string;
    title?: string;
    isPublic: boolean;
    runningTime?: number;
    type: "image" | "video";
}

// ===== User Profile DTO =====
export interface SilhouetteUserDto {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
}

// ===== Silhouette Response DTO =====
export enum SilhouetteType {
    IMAGE = "image",
    VIDEO = "video",
}

export interface ResponseSilhouetteDto {
    id: number;
    title: string;
    contentUrl: string;
    type: SilhouetteType;
    createdAt: string;

    // relations
    profile: SimpleProfileDto;
}

export interface SimpleProfileDto {
    id: number;
    nickname: string;
    avatarUrl?: string;
}
