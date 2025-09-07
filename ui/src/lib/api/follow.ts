import apiClient from "./client";
import { Profile } from "../types/user.interface";

export const followApi = {
    getFollowers: async (id: number): Promise<Profile[]> => {
        const response = await apiClient.get(`api/profiles/${id}/followers`);
        return response.data.data;
    },

    getFollowings: async (id: number): Promise<Profile[]> => {
        const response = await apiClient.get(`api/profiles/${id}/followings`);
        return response.data.data;
    },

    getMyFollowings: async (): Promise<Profile[]> => {
        const response = await apiClient.get(`api/profiles/me/followings`);
        return response.data.data;
    },

    toggleFollow: async (id: number) => {
        const response = await apiClient.post(`api/profiles/${id}/follow`);
        return response.data.data;
    },

    getFollowCounts: async (id: number): Promise<{ followers: number; followings: number }> => {
        const response = await apiClient.get(`api/profiles/${id}/follow-counts`);
        return response.data.data;
    },
};