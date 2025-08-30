"use client";

import { useState } from "react";
import Image from "next/image";
import { fileApi } from "@/lib/api/file";

interface ProfileImageUploadProps {
    currentImageUrl?: string;
    onImageUrlChange: (url: string) => void;
    disabled?: boolean;
}

export default function ProfileImageUpload({
    currentImageUrl,
    onImageUrlChange,
    disabled = false,
}: ProfileImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB를 초과할 수 없습니다.");
            return;
        }

        // 파일 타입 체크
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있습니다.");
            return;
        }

        try {
            setUploading(true);

            // 미리보기 생성
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            // 파일 업로드
            const response = await fileApi.uploadFile(file, "user");

            // 디버깅용 로그
            console.log("Upload response:", response);
            console.log("Image URL:", response.url);

            // 업로드 성공 시 부모 컴포넌트에 URL 전달
            onImageUrlChange(response.url);

            // 미리보기 URL 정리
            URL.revokeObjectURL(previewUrl);
            setPreview(null);
        } catch (error) {
            console.error("파일 업로드 실패:", error);
            alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");

            // 미리보기 URL 정리
            if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
            }
        } finally {
            setUploading(false);
        }
    };

    const displayImageUrl = preview || currentImageUrl;

    return (
        <div className="profile-image-upload">
            {/* 이미지 미리보기 */}
            <div className="image-preview-container">
                <div className="image-preview">
                    {displayImageUrl ? (
                        <Image
                            src={displayImageUrl}
                            alt="프로필 이미지"
                            width={128}
                            height={128}
                            className="preview-image"
                            onError={(e) => {
                                console.error("Image load error:", e);
                                console.log("Failed to load image URL:", displayImageUrl);
                            }}
                            onLoad={() => {
                                console.log("Image loaded successfully:", displayImageUrl);
                            }}
                        />
                    ) : (
                        <div className="no-image-placeholder">이미지 없음</div>
                    )}
                </div>

                {uploading && (
                    <div className="upload-overlay">
                        <div className="upload-text">업로드 중...</div>
                    </div>
                )}
            </div>

            {/* 통합된 파일 선택 버튼 */}
            <div className="file-upload-wrapper">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled || uploading}
                    className="file-input"
                    id="profile-image-input"
                />
                <label
                    htmlFor="profile-image-input"
                    className={`upload-button ${disabled || uploading ? 'disabled' : ''}`}
                >
                    {uploading ? "업로드 중..." : "이미지 선택"}
                </label>
            </div>

            {/* 파일 형식 및 크기 안내 */}
            <p className="upload-info">
                JPG, PNG, GIF, WebP 형식
                <br />
                최대 5MB
            </p>
        </div>
    );
}
