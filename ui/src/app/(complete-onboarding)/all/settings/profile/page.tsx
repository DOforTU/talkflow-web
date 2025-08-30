"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { profileApi, UpdateProfileDto } from "@/lib/api/profile";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { useRouter } from "next/navigation";
import "./ProfileSettings.css";

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user, profile, setProfile } = useAuthStore();
    const [saving, setSaving] = useState(false);

    // 폼 상태
    const [formData, setFormData] = useState({
        nickname: "",
        avatarUrl: "",
        language: "ko" as "ko" | "en",
        bio: "",
        version: 0,
    });

    // 프로필 데이터 로드
    useEffect(() => {
        if (profile) {
            setFormData({
                nickname: profile.nickname || "",
                avatarUrl: profile.avatarUrl || "",
                language: (profile.language as "ko" | "en") || "ko",
                bio: profile.bio || "",
                version: profile.version || 0,
            });
        }
    }, [profile]);

    // 로그인하지 않은 사용자 리디렉션
    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUrlChange = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            avatarUrl: url,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile) {
            alert("프로필 정보를 불러올 수 없습니다.");
            return;
        }

        try {
            setSaving(true);

            const updateData: UpdateProfileDto = {
                nickname: formData.nickname,
                avatarUrl: formData.avatarUrl,
                language: formData.language,
                bio: formData.bio,
                version: formData.version,
            };

            const updatedProfile = await profileApi.updateProfile(Number(profile.id), updateData);

            // 스토어의 프로필 정보 업데이트
            setProfile(updatedProfile);

            alert("프로필이 성공적으로 업데이트되었습니다!");
        } catch (error: unknown) {
            console.error("프로필 업데이트 실패:", error);

            // axios 에러인지 확인
            interface AxiosError {
                response?: {
                    status: number;
                };
            }

            const isAxiosError = error && typeof error === "object" && "response" in error;
            const status = isAxiosError ? (error as AxiosError).response?.status : null;

            if (status === 409) {
                alert("동시 수정이 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.");
            } else if (status === 400) {
                alert("입력 데이터가 올바르지 않습니다. 다시 확인해주세요.");
            } else {
                alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (!user || !profile) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="profile-settings-page">
            <div className="profile-settings-container">
                <div className="profile-settings-header">
                    <button type="button" onClick={() => router.back()} className="back-button" disabled={saving}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="page-title">프로필 설정</h1>
                </div>

                <form onSubmit={handleSubmit} className="profile-settings-form">
                    {/* 프로필 이미지 섹션 */}
                    <div className="form-section">
                        <div className="image-upload-section">
                            <ProfileImageUpload
                                currentImageUrl={formData.avatarUrl}
                                onImageUrlChange={handleImageUrlChange}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    {/* 기본 정보 섹션 */}
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="nickname" className="form-label">
                                닉네임
                            </label>
                            <input
                                type="text"
                                id="nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="form-input"
                                placeholder="닉네임을 입력하세요"
                                minLength={4}
                                maxLength={30}
                                pattern="^[a-zA-Z0-9_가-힣]+$"
                                required
                            />
                            <p className="form-help-text">4-30자, 영문/숫자/한글/밑줄(_)만 사용 가능 (공백 불가)</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="language" className="form-label">
                                언어
                            </label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="form-select"
                            >
                                <option value="ko">한국어</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio" className="form-label">
                                자기소개
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="form-textarea"
                                placeholder="자기소개를 입력하세요 (선택사항)"
                                rows={4}
                                maxLength={500}
                            />
                            <p className="form-help-text">최대 500자</p>
                        </div>
                    </div>

                    {/* 저장 버튼 */}
                    <div className="form-actions">
                        <button type="submit" disabled={saving} className="save-button btn-primary">
                            {saving ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </form>

                {/* 디버그 정보 */}
                <div className="debug-section">
                    <h3 className="debug-title">디버그 정보 (Google Storage 테스트용)</h3>
                    <div className="debug-info">
                        <div>
                            <strong>사용자 ID:</strong> {user.id}
                        </div>
                        <div>
                            <strong>프로필 ID:</strong> {profile.id}
                        </div>
                        <div>
                            <strong>현재 닉네임:</strong> {profile.nickname}
                        </div>
                        <div>
                            <strong>현재 아바타 URL:</strong> {profile.avatarUrl}
                        </div>
                        <div>
                            <strong>프로필 버전:</strong> {formData.version}
                        </div>
                        <div className="test-instructions">
                            <p className="test-instructions-title">Google Storage 테스트 방법:</p>
                            <ul className="test-instructions-list">
                                <li>이미지를 선택하면 Google Cloud Storage에 업로드됩니다</li>
                                <li>저장 후 기존 이미지는 자동으로 삭제됩니다</li>
                                <li>Network 탭에서 API 호출을 확인할 수 있습니다</li>
                                <li>업로드된 이미지 URL이 아바타 URL에 표시됩니다</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
