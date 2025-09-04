import apiClient from "./client";
import { Profile, UpdateProfileDto } from "../types/user.interface";

export const profileApi = {
    // 프로필 조회 (닉네임으로)
    getProfileByNickname: async (nickname: string): Promise<Profile> => {
        const response = await apiClient.get(`api/profiles/${nickname}`);
        return response.data.data;
    },

    // 프로필 업데이트
    updateProfile: async (profileId: number, updateData: UpdateProfileDto): Promise<Profile> => {
        const response = await apiClient.patch(`api/profiles/${profileId}`, updateData);
        return response.data.data;
    },

    // 기본 이미지로 변경
    resetToDefaultAvatar: async (profileId: number): Promise<Profile> => {
        const response = await apiClient.post(`api/profiles/${profileId}/reset-avatar`);
        return response.data.data;
    },
};
