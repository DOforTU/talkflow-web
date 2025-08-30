import apiClient from "./client";
import { Profile } from "../types/users.interface";

export interface UpdateProfileDto {
    nickname?: string;
    avatarUrl?: string;
    language?: "ko" | "en";
    bio?: string;
    version: number;
}

export interface ResponseProfileDto {
    id: number;
    nickname: string;
    avatarUrl: string;
    language: string | null;
    bio: string | null;
}

export const profileApi = {
    // 프로필 조회 (닉네임으로)
    getProfileByNickname: async (nickname: string): Promise<ResponseProfileDto> => {
        const response = await apiClient.get(`api/profiles/${nickname}`);
        return response.data.data;
    },

    // 프로필 업데이트
    updateProfile: async (profileId: number, updateData: UpdateProfileDto): Promise<Profile> => {
        const response = await apiClient.patch(`api/profiles/${profileId}`, updateData);
        return response.data.data;
    },
};
