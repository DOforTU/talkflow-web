import { create } from "zustand";
// ===== Create Silhouette DTO =====
export interface CreateSilhouetteDto {
    title: string;
    description?: string;
    contentUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    tags?: string[];
}

// ===== Update Silhouette DTO =====
export interface UpdateSilhouetteDto {
    title?: string;
    description?: string;
    contentUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    tags?: string[];
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
