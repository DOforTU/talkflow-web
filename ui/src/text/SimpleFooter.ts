export interface SimpleFooterTexts {
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
}

export const simpleFooterTexts: Record<"ENG" | "KOR", SimpleFooterTexts> = {
    ENG: {
        about: "About",
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
        copyright: " 2025 Silhouette. All rights reserved.",
    },
    KOR: {
        about: "Silhouette이란",
        privacy: "정책",
        terms: "이용 약관",
        contact: "연락처",
        copyright: " 2025 Silhouette. 모든 권리 보유.",
    },
};
