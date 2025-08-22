export interface WebHeaderTexts {
    start: string;
    about: string;
    features: string;
    pricing: string;
}

export const webHeaderTexts: Record<"ENG" | "KOR", WebHeaderTexts> = {
    ENG: {
        start: "Start",
        about: "About",
        features: "Features",
        pricing: "Pricing",
    },
    KOR: {
        start: "시작하기",
        about: "소개",
        features: "기능",
        pricing: "가격",
    },
};
