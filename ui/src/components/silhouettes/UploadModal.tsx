"use client";

import { useState, useEffect, useRef } from "react";
import { fileApi } from "../../lib/api/file";
import { silhouetteApi } from "../../lib/api/silhouette";
import "./UploadModal.css";

interface UploadModalProps {
    isOpen: boolean;
    onClose: (uploaded?: boolean) => void;
}

interface UploadFile {
    file: File;
    preview: string;
    type: "image" | "video";
    duration?: number; // 비디오 러닝타임 (초) 최대 15초. 이미지라면 기본값 15초
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [title, setTitle] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Cleanup preview URLs when modal closes
    useEffect(() => {
        if (!isOpen) {
            // 현재 uploadFiles 상태를 사용해서 cleanup
            uploadFiles.forEach((file) => URL.revokeObjectURL(file.preview));
            setUploadFiles([]);
            setCurrentIndex(0);
            setTitle("");
            setIsPublic(true);
            setShowSettings(false);
        }
    }, [isOpen]); // uploadFiles 의존성 제거

    // 비디오 러닝타임을 가져오는 함수
    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(Math.round(video.duration));
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const handleFileSelect = async (files: File[]) => {
        const newFiles = await Promise.all(
            files.map(async (file) => {
                const type = file.type.startsWith("video/") ? ("video" as const) : ("image" as const);
                const duration = type === "video" ? await getVideoDuration(file) : undefined;

                return {
                    file,
                    preview: URL.createObjectURL(file),
                    type,
                    duration,
                };
            })
        );
        setUploadFiles((prev) => [...prev, ...newFiles]);
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            await handleFileSelect(files);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(
            (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        if (files.length > 0) {
            await handleFileSelect(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const removeFile = (index: number) => {
        const fileToRemove = uploadFiles[index];
        URL.revokeObjectURL(fileToRemove.preview);
        setUploadFiles((prev) => prev.filter((_, i) => i !== index));
        if (currentIndex >= uploadFiles.length - 1) {
            setCurrentIndex(Math.max(0, uploadFiles.length - 2));
        }
    };

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        setIsUploading(true);
        try {
            // 첫 번째 파일만 업로드 (다중 파일은 추후 구현)
            const currentFile = uploadFiles[currentIndex];

            // 1. 파일을 GCS에 업로드
            const uploadResponse = await fileApi.uploadFile(currentFile.file, "silhouette");

            // 2. 실루엣 생성
            await silhouetteApi.createSilhouette({
                contentUrl: uploadResponse.url,
                title: title.trim() || undefined,
                isPublic: isPublic,
                runningTime: currentFile.duration,
                type: currentFile.type === "video" ? "video" : "image",
            });

            onClose(true); // 업로드 성공시 true 전달
        } catch (error) {
            console.error("Upload failed:", error);
            // TODO: 에러 메시지 UI 표시
        } finally {
            setIsUploading(false);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!isOpen) return null;

    return (
        <div className="upload-modal-overlay" onClick={() => onClose()}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="upload-modal-header">
                    {uploadFiles.length > 0 && (
                        <button
                            onClick={() => {
                                setUploadFiles([]);
                                setCurrentIndex(0);
                                setTitle("");
                                setShowSettings(false);
                            }}
                            className="delete-btn"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3,6 5,6 21,6" />
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    )}
                    <button onClick={() => onClose()} className="close-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="upload-modal-content">
                    {uploadFiles.length === 0 ? (
                        <div
                            className={`upload-dropzone ${isDragOver ? "drag-over" : ""}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="upload-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14,2 14,8 20,8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h3>파일을 드래그하거나 클릭하여 선택</h3>
                            <p>이미지 또는 동영상 파일을 업로드하세요</p>
                            <button className="select-files-btn">파일 선택</button>
                        </div>
                    ) : (
                        <div className="upload-preview">
                            {/* Preview Slide */}
                            <div className="preview-slide">
                                <div className="preview-media">
                                    {uploadFiles[currentIndex]?.type === "video" ? (
                                        <video
                                            src={uploadFiles[currentIndex].preview}
                                            className="preview-video"
                                            controls
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={uploadFiles[currentIndex]?.preview}
                                            alt="Preview"
                                            className="preview-image"
                                        />
                                    )}
                                </div>

                                {/* Remove button */}
                                <button onClick={() => removeFile(currentIndex)} className="remove-file-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="3,6 5,6 21,6" />
                                        <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Settings Toggle Button - 콘텐츠 밖으로 이동 */}
                    {uploadFiles.length > 0 && (
                        <button onClick={() => setShowSettings(!showSettings)} className="settings-toggle-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6" />
                                <path d="M1 12h6m6 0h6" />
                            </svg>
                            콘텐츠 설정
                        </button>
                    )}
                </div>

                {/* Settings Slide Up Panel */}
                <div className={`settings-panel ${showSettings ? "show" : ""}`}>
                    <div className="settings-panel-content">
                        <div className="settings-header">
                            <h3>콘텐츠 설정</h3>
                            <button onClick={() => setShowSettings(false)} className="close-settings-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="settings-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="실루엣 제목을 입력하세요 (선택사항)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            checked={isPublic}
                                            onChange={() => setIsPublic(true)}
                                        />
                                        <span className="radio-text">공개</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            checked={!isPublic}
                                            onChange={() => setIsPublic(false)}
                                        />
                                        <span className="radio-text">비공개</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                className={`upload-submit-btn ${
                                    uploadFiles.length === 0 || isUploading ? "disabled" : ""
                                }`}
                                disabled={uploadFiles.length === 0 || isUploading}
                            >
                                {isUploading ? "업로드 중..." : "업로드"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                />
            </div>
        </div>
    );
}
