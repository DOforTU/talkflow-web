"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SupportedLanguage } from "@/lib/types/user.interface";
import { useAuthStore } from "@/store/authStore";

export type Language = "ENG" | "KOR";

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
    getProfileBasedLanguage: (profileLanguage?: SupportedLanguage) => SupportedLanguage;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>("ENG");

    const setLanguage = (language: Language) => {
        setCurrentLanguage(language);
        // 추후 localStorage에 저장할 수도 있음
        // localStorage.setItem("language", language);
    };

    // Profile 언어를 기반으로 SupportedLanguage 반환 (인증된 페이지용)
    const getProfileBasedLanguage = (profileLanguage?: SupportedLanguage): SupportedLanguage => {
        return profileLanguage === SupportedLanguage.EN ? SupportedLanguage.EN : SupportedLanguage.KO;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, getProfileBasedLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

// 인증된 페이지에서 사용할 훅 (profile 언어 기반)
export function useProfileLanguage() {
    const { getProfileBasedLanguage } = useLanguage();

    return {
        getLanguage: (profileLanguage?: SupportedLanguage) => getProfileBasedLanguage(profileLanguage),
    };
}

// Auth와 Language를 통합한 편의 훅 (새로운 Auth Store 사용)
// 사용법: const { currentLanguage } = useAuthLanguage();
export function useAuthLanguage() {
    const { profile } = useAuthStore();
    const { getProfileBasedLanguage } = useLanguage();

    const currentLanguage = getProfileBasedLanguage(profile?.language);

    return { currentLanguage };
}
