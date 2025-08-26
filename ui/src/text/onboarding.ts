export interface OnboardingTexts {
    loading: {
        message: string;
    };
    header: {
        title: string;
    };
    nameSection: {
        title: string;
        firstName: string;
        lastName: string;
        nickname: string;
        nicknamePlaceholder: string;
    };
    languageSection: {
        title: string;
        selectPlaceholder: string;
        options: {
            ko: string;
            en: string;
        };
    };
    actions: {
        submitButton: string;
        submittingButton: string;
    };
    alerts: {
        fillAllFields: string;
        profileUpdateError: string;
    };
}

export const onboardingTexts: Record<"ENG" | "KOR", OnboardingTexts> = {
    ENG: {
        loading: {
            message: "Loading...",
        },
        header: {
            title: "Welcome to SayPlan!",
        },
        nameSection: {
            title: "Personal Information",
            firstName: "First Name",
            lastName: "Last Name",
            nickname: "Nickname",
            nicknamePlaceholder: "Enter your preferred nickname",
        },
        languageSection: {
            title: "Language Settings",
            selectPlaceholder: "Select a language",
            options: {
                ko: "한국어",
                en: "English",
            },
        },
        actions: {
            submitButton: "Get Started",
            submittingButton: "Setting up...",
        },
        alerts: {
            fillAllFields: "Please fill in all the required information.",
            profileUpdateError: "An error occurred while setting up your profile.",
        },
    },
    KOR: {
        loading: {
            message: "로딩 중...",
        },
        header: {
            title: "Welcome to SayPlan!",
        },
        nameSection: {
            title: "이름 정보",
            firstName: "이름",
            lastName: "성",
            nickname: "닉네임",
            nicknamePlaceholder: "사용하실 닉네임을 입력해주세요",
        },
        languageSection: {
            title: "언어 설정",
            selectPlaceholder: "언어를 선택하세요",
            options: {
                ko: "한국어",
                en: "English",
            },
        },
        actions: {
            submitButton: "시작하기",
            submittingButton: "설정 중...",
        },
        alerts: {
            fillAllFields: "모든 정보를 입력해주세요.",
            profileUpdateError: "프로필 설정 중 오류가 발생했습니다.",
        },
    },
};
