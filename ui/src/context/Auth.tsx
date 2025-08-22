"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType, User, Profile, CurrentUserDTO } from "@/lib/types/users.interface";
import {
    loginWithGoogle as loginGoogleApi,
    refreshToken,
    logout as logoutApi,
    loginWithLocal as loginLocalApi,
} from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/users";
import { mapCommon } from "@/lib/utils/mapCommon";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// DTO에서 클라이언트 타입으로 변환하는 유틸리티 함수
function mapUserDTOToUser(userDTO: Omit<CurrentUserDTO, "profile">): User {
    return {
        ...mapCommon(userDTO),
        id: userDTO.id,
        email: userDTO.email,
        username: userDTO.username,
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        role: userDTO.role,
        provider: userDTO.provider,
        lastLogin: userDTO.lastLogin ? new Date(userDTO.lastLogin) : null,
    };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 최초 유저 정보 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();

                // User와 Profile 데이터 분리 및 타입 변환
                const { profile, ...userDTO } = userData;

                setCurrentUser(mapUserDTOToUser(userDTO));
                setCurrentProfile(profile);
            } catch {
                setCurrentUser(null);
                setCurrentProfile(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    // 토큰 자동 갱신
    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(async () => {
            try {
                await refreshToken();
            } catch {
                await logoutApi();
                setCurrentUser(null);
                setCurrentProfile(null);
            }
        }, 10 * 60 * 1000); // 10분

        return () => clearInterval(interval);
    }, [currentUser]);

    const setUser = (user: User | null) => setCurrentUser(user);
    const setProfile = (profile: Profile | null) => setCurrentProfile(profile);
    const clearUser = () => {
        setCurrentUser(null);
        setCurrentProfile(null);
    };

    const logout = async () => {
        await logoutApi();
        clearUser();
    };

    const handleLocalLogin = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            await loginLocalApi(email, password);

            const userData = await getCurrentUser();

            // User와 Profile 데이터 분리 및 타입 변환
            const { profile, ...userDTO } = userData;

            setCurrentUser(mapUserDTOToUser(userDTO));
            setCurrentProfile(profile);

            return true;
        } catch (error) {
            console.error("Local login failed:", error);
            clearUser();
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await loginGoogleApi();

            const userData = await getCurrentUser();

            // User와 Profile 데이터 분리 및 타입 변환
            const { profile, ...userDTO } = userData;

            setCurrentUser(mapUserDTOToUser(userDTO));
            setCurrentProfile(profile);
        } catch (error) {
            console.error("Google login failed:", error);
            clearUser();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                currentProfile,
                isLoading,
                setUser,
                setProfile,
                clearUser,
                logout,
                loginWithGoogle: handleGoogleLogin,
                loginWithLocal: handleLocalLogin,
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
