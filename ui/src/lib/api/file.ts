import apiClient from "./client";

export interface FileUploadResponse {
    url: string;
}

export const fileApi = {
    // 파일 업로드 (사용자 프로필 이미지)
    uploadFile: async (file: File, type: "user" | "team" = "user"): Promise<FileUploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(`api/files/upload?type=${type}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    },
};
