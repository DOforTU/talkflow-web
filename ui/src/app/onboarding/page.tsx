"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/Auth";
import { useLanguage } from "@/context/Language";
import { completeOnboarding } from "@/lib/api/auth";
import { onboardingTexts } from "@/text/onboarding";
import "./AppStartPage.css";
import LanguageSelector from "@/components/LanguageSelector";
import SmartHeader from "@/components/headers/SmartHeader";

export default function AppStartPage() {
    const router = useRouter();
    const { currentUser, currentProfile, isLoading } = useAuth();
    const { currentLanguage } = useLanguage();
    const texts = onboardingTexts[currentLanguage];

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        nickname: "",
        language: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 온보딩 완료 여부 체크
    // 온보딩 완료 여부 체크: firstName, lastName, language 모두 true일 때만 완료
    const isOnboardingComplete = useCallback(() => {
        return currentProfile?.language && currentUser?.firstName && currentUser?.lastName;
    }, [currentProfile?.language, currentUser?.firstName, currentUser?.lastName]);

    // 로그인 상태 및 온보딩 완료 여부에 따라 리다이렉트
    useEffect(() => {
        if (!isLoading) {
            if (!currentUser) {
                router.push("/");
                return;
            }

            if (isOnboardingComplete()) {
                router.push("/home");
                return;
            }

            // 온보딩이 필요한 경우 기존 데이터로 폼 초기화
            if (currentUser && currentProfile) {
                setFormData({
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    nickname: currentProfile.nickname,
                    language: currentProfile.language || "",
                });
            }
        }
    }, [currentUser, currentProfile, isLoading, router, isOnboardingComplete]);

    // 폼 제출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.nickname || !formData.language) {
            alert(texts.alerts.fillAllFields);
            return;
        }

        setIsSubmitting(true);

        try {
            // API 호출로 온보딩 완료
            const response = await completeOnboarding({
                firstName: formData.firstName,
                lastName: formData.lastName,
                nickname: formData.nickname,
                language: formData.language,
            });

            if (response.data.success) {
                // 온보딩 완료 후 페이지 새로고침하여 Auth Context 업데이트
                window.location.href = "/home";
            } else {
                throw new Error(response.data.message || "Unknown error");
            }
        } catch (error: unknown) {
            console.error("Profile update error:", error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                texts.alerts.profileUpdateError;
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로딩 중이거나 리다이렉트 대상인 경우
    if (isLoading || !currentUser || isOnboardingComplete()) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="app-start-page">
            <SmartHeader>
                <header className="simple-header">
                    <LanguageSelector />
                </header>
            </SmartHeader>

            <div className="onboarding-container">
                <div className="onboarding-header">
                    <h1 className="onboarding-title">{texts.header.title}</h1>
                </div>

                <form className="onboarding-form" onSubmit={handleSubmit}>
                    {/* 이름 정보 */}
                    <div className="form-section">
                        <h3 className="section-title">{texts.nameSection.title}</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">{texts.nameSection.firstName}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                    maxLength={30}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{texts.nameSection.lastName}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                    maxLength={30}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{texts.nameSection.nickname}</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nickname}
                                onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                                maxLength={30}
                                placeholder={texts.nameSection.nicknamePlaceholder}
                            />
                        </div>
                    </div>

                    {/* 언어 설정 */}
                    <div className="form-section">
                        <h3 className="section-title">{texts.languageSection.title}</h3>

                        <div className="form-group">
                            <select
                                className="form-select"
                                value={formData.language}
                                onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                            >
                                <option value="">{texts.languageSection.selectPlaceholder}</option>
                                <option value="ko">{texts.languageSection.options.ko}</option>
                                <option value="en">{texts.languageSection.options.en}</option>
                            </select>
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className={`submit-button ${isSubmitting ? "loading" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? texts.actions.submittingButton : texts.actions.submitButton}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
