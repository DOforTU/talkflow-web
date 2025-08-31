import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCurrentUser,
    loginWithLocal as loginLocalApi,
    logout as logoutApi,
    refreshToken as refreshTokenApi,
} from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { mapCommon } from "@/lib/utils/mapCommon";
import { UserWithProfileDTO, User } from "@/lib/types/user.interface";

// DTO에서 클라이언트 타입으로 변환
function mapUserDTOToUser(userDTO: Omit<UserWithProfileDTO, "profile">): User {
    return {
        ...mapCommon(userDTO),
        id: userDTO.id,
        email: userDTO.email,
        username: userDTO.username,
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        role: userDTO.role,
        provider: userDTO.provider,
        version: userDTO.version,
        lastLogin: userDTO.lastLogin ? new Date(userDTO.lastLogin) : null,
    };
}

// 현재 사용자 정보 조회
export function useCurrentUser() {
    const { setUser, setProfile, clearAuth } = useAuthStore();

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const userData = await getCurrentUser();
            const { profile, ...userDTO } = userData;

            const user = mapUserDTOToUser(userDTO);
            setUser(user);
            setProfile(profile);

            return { user, profile };
        },
        enabled: true, // 항상 실행하되, 에러시 clearAuth 처리
        retry: (failureCount, error: unknown) => {
            // 401/403 에러는 재시도하지 않음
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                clearAuth();
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000, // 5분간 fresh
        gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (구 cacheTime)
    });
} // Google 로그인 (리다이렉트 방식)
export function useGoogleLogin() {
    return {
        login: () => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
        },
    };
}

// 로컬 로그인
export function useLocalLogin() {
    const queryClient = useQueryClient();
    const { setUser, setProfile } = useAuthStore();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => loginLocalApi(email, password),
        onSuccess: async () => {
            // 로그인 성공 후 사용자 정보 가져오기
            const userData = await getCurrentUser();
            const { profile, ...userDTO } = userData;

            const user = mapUserDTOToUser(userDTO);
            setUser(user);
            setProfile(profile);

            // 캐시 무효화 및 새로고침
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error) => {
            console.error("Local login failed:", error);
        },
    });
}

// 로그아웃
export function useLogout() {
    const queryClient = useQueryClient();
    const { clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            clearAuth();
            // 모든 쿼리 캐시 클리어
            queryClient.clear();
        },
        onError: (error) => {
            // 에러가 있어도 로컬 상태는 정리
            clearAuth();
            queryClient.clear();
            console.error("Logout error:", error);
        },
    });
}

// 토큰 갱신 (백그라운드)
export function useTokenRefresh() {
    const { clearAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refreshTokenApi,
        onError: async (error) => {
            console.error("Token refresh failed:", error);
            clearAuth();
            queryClient.clear();
            // 필요시 로그인 페이지로 리다이렉트
        },
    });
}

// 자동 토큰 갱신 (컴포넌트에서 사용)
export function useAutoTokenRefresh() {
    const { mutate: refreshToken } = useTokenRefresh();
    const { isAuthenticated } = useAuthStore();

    React.useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            refreshToken();
        }, 10 * 60 * 1000); // 10분마다

        return () => clearInterval(interval);
    }, [isAuthenticated, refreshToken]);
}
