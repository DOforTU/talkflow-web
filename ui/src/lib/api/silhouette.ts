import { CreateSilhouetteDto, ResponseSilhouetteDto } from "../types/silhouette.interface";
import apiClient from "./client";

export const silhouetteApi = {
    // Get all silhouettes with pagination
    getAllSilhouettes: async (limit: number = 10, offset: number = 0): Promise<ResponseSilhouetteDto[]> => {
        const response = await apiClient.get(`api/silhouettes?limit=${limit}&offset=${offset}`);
        return response.data.data;
    },

    // Get my silhouettes
    getMySilhouettes: async (): Promise<ResponseSilhouetteDto[]> => {
        const response = await apiClient.get(`api/silhouettes/my`);
        return response.data.data;
    },

    // Get silhouette by ID
    getSilhouetteById: async (silhouetteId: number): Promise<ResponseSilhouetteDto> => {
        const response = await apiClient.get(`api/silhouette/${silhouetteId}`);
        return response.data.data;
    },

    // Create silhouette
    createSilhouette: async (silhouetteData: CreateSilhouetteDto): Promise<ResponseSilhouetteDto> => {
        const response = await apiClient.post(`api/silhouettes/create`, silhouetteData);
        return response.data.data;
    },

    // Delete silhouette
    deleteSilhouette: async (silhouetteId: number): Promise<void> => {
        await apiClient.delete(`api/silhouettes/${silhouetteId}`);
    },

    // Like silhouette
    likeSilhouette: async (silhouetteId: number): Promise<void> => {
        await apiClient.post(`api/silhouettes/${silhouetteId}/like`);
    },

    // Unlike silhouette
    unlikeSilhouette: async (silhouetteId: number): Promise<void> => {
        await apiClient.delete(`api/silhouettes/${silhouetteId}/like`);
    },
};
