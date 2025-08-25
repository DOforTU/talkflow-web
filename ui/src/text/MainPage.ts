export interface MainPageTexts {
    description: string;
    learnMoreButton: string;
    signInButton: string;
}

export const mainPageTexts: Record<"ENG" | "KOR", MainPageTexts> = {
    ENG: {
        description:
            "Your smart planner that adapts to you. Just speak, and your plan is complete.Plan your day and share your achievements with the world.",
        learnMoreButton: "Learn More About Silhouette",
        signInButton: "Sign in with Google",
    },
    KOR: {
        description:
            "당신에게 맞춰지는 스마트 플래너. 말로 하면 계획이 완성돼요. 일상을 계획하고, 당신의 성취를 세상과 공유하세요.",
        learnMoreButton: "Silhouette에 대해 더 알아보기",
        signInButton: "구글 계정으로 로그인",
    },
};
