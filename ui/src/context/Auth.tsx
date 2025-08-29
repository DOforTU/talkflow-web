"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useCurrentUser, useAutoTokenRefresh } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { AuthContextType } from "@/lib/types/users.interface";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, profile } = useAuthStore();
    const { isLoading, error } = useCurrentUser();

    // 자동 토큰 갱신
    useAutoTokenRefresh();

    // 에러 발생시 로그아웃 처리
    useEffect(() => {
        if (error) {
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                useAuthStore.getState().clearAuth();
            }
        }
    }, [error]);

    return (
        <AuthContext.Provider
            value={{
                currentUser: user,
                currentProfile: profile,
                isLoading,
                // 레거시 호환성을 위한 메서드들 (이제는 hooks를 직접 사용 권장)
                setUser: useAuthStore.getState().setUser,
                setProfile: useAuthStore.getState().setProfile,
                clearUser: useAuthStore.getState().clearAuth,
                logout: async () => {
                    // useLogout hook을 컴포넌트에서 사용하는 것을 권장
                    console.warn("Use useLogout hook instead of context logout method");
                    useAuthStore.getState().clearAuth();
                },
                loginWithGoogle: async () => {
                    // useGoogleLogin hook을 컴포넌트에서 사용하는 것을 권장
                    console.warn("Use useGoogleLogin hook instead of context method");
                    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
                },
                loginWithLocal: async () => {
                    // useLocalLogin hook을 컴포넌트에서 사용하는 것을 권장
                    console.warn("Use useLocalLogin hook instead of context method");
                    return false;
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
