"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "ENG" | "KOR";

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>("ENG");

    const setLanguage = (language: Language) => {
        setCurrentLanguage(language);
        // 추후 localStorage에 저장할 수도 있음
        // localStorage.setItem("language", language);
    };

    return <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
