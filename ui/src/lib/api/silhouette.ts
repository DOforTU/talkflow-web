import { CreateSilhouetteDto, ResponseSilhouetteDto, UpdateSilhouetteDto } from "../types/silhouette.interface";
import apiClient from "./client";

export const silhouetteApi = {
    // Get all silhouettes
    getAllSilhouettes: async (): Promise<ResponseSilhouetteDto[]> => {
        const response = await apiClient.get(`api/silhouettes`);
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
        const response = await apiClient.post(`api/silhouettes`, silhouetteData);
        return response.data.data;
    },

    // Update silhouette
    updateSilhouette: async (
        silhouetteId: number,
        silhouetteData: UpdateSilhouetteDto
    ): Promise<ResponseSilhouetteDto> => {
        const response = await apiClient.patch(`api/silhouettes/${silhouetteId}`, silhouetteData);
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
