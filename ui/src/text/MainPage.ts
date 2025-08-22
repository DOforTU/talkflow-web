export interface MainPageTexts {
    title: string;
    description: string;
    learnMoreButton: string;
    signInButton: string;
}

export const mainPageTexts: Record<"ENG" | "KOR", MainPageTexts> = {
    ENG: {
        title: "Welcome to SayPlan",
        description:
            "The smart planner that adapts to you. Just say it, and it's planned.\nExperience intelligent scheduling with voice and location optimization.",
        learnMoreButton: "Learn More About SayPlan",
        signInButton: "Sign in with Google",
    },
    KOR: {
        title: "Welcome to SayPlan",
        description:
            "사용자에게 맞춰가는 스마트 플래너입니다. 말하기만 하면 계획이 완성됩니다.\n음성 인식과 위치 최적화로 지능적인 일정 관리를 경험하세요.",
        learnMoreButton: "SayPlan에 대해 더 알아보기",
        signInButton: "구글 계정으로 로그인",
    },
};
