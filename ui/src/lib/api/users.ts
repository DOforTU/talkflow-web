import { CurrentUserDTO } from "../types/users.interface";
import apiClient from "./client";

export async function getCurrentUser(): Promise<CurrentUserDTO> {
    const response = await apiClient.get("/api/users/me");
    return response.data.data;
}
