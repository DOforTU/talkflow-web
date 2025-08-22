"use client";

import "./LanguageSelector.css";
import { useLanguage } from "@/context/Language";

interface LanguageSelectorProps {
    className?: string;
}

export default function LanguageSelector({
    className = "",
}: LanguageSelectorProps) {
    const { currentLanguage, setLanguage } = useLanguage();

    return (
        <div className={`language-selector ${className}`}>
            <button
                className={`lang-btn ${currentLanguage === "ENG" ? "active" : ""}`}
                onClick={() => setLanguage("ENG")}
            >
                ENG
            </button>
            <div className="lang-divider"></div>
            <button
                className={`lang-btn ${currentLanguage === "KOR" ? "active" : ""}`}
                onClick={() => setLanguage("KOR")}
            >
                KOR
            </button>
        </div>
    );
}
