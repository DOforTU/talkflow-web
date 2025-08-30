import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, Profile } from "@/lib/types/users.interface";

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                profile: null,
                isAuthenticated: false,

                setUser: (user) =>
                    set(
                        {
                            user,
                            isAuthenticated: !!user, // user가 있으면 true, 없으면 false
                        },
                        false,
                        "setUser"
                    ),

                setProfile: (profile) =>
                    set(
                        {
                            profile,
                        },
                        false,
                        "setProfile"
                    ),

                clearAuth: () =>
                    set(
                        {
                            user: null,
                            profile: null,
                            isAuthenticated: false,
                        },
                        false,
                        "clearAuth"
                    ),
            }),
            {
                name: "auth-storage",
                // 민감한 데이터는 저장하지 않고 쿠키가 있으면 API 호출로 사용자 정보 복원
                partialize: () => ({}),
            }
        ),
        { name: "auth-store" }
    )
);
