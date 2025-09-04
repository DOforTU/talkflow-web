"use client";

import { useState } from "react";
import "./UpdateOptionsModal.css";

interface UpdateOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateSingle: () => void;
    onUpdateRecurring: () => void;
    onUpdateFromThis: () => void;
    isRecurring: boolean;
    eventTitle: string;
    showSingleOption: boolean;
    showRecurringOption?: boolean;
    showFromThisOption?: boolean;
}

export default function UpdateOptionsModal({
    isOpen,
    onClose,
    onUpdateSingle,
    onUpdateRecurring,
    onUpdateFromThis,
    isRecurring,
    eventTitle,
    showSingleOption,
    showRecurringOption = true,
    showFromThisOption = true,
}: UpdateOptionsModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen) return null;

    const handleUpdateSingle = async () => {
        setIsUpdating(true);
        try {
            onUpdateSingle();
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateRecurring = async () => {
        setIsUpdating(true);
        try {
            onUpdateRecurring();
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateFromThis = async () => {
        setIsUpdating(true);
        try {
            onUpdateFromThis();
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="update-options-modal-overlay" onClick={onClose}>
            <div className="update-options-modal" onClick={(e) => e.stopPropagation()}>
                <div className="update-modal-header">
                    <h2>일정 수정</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="모달 닫기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="update-modal-content">
                    <div className="event-title-display">
                        <strong>"{eventTitle}"</strong>
                    </div>

                    {isRecurring ? (
                        <>
                            <p className="update-description">이 일정은 반복 일정입니다.</p>
                            <div className="update-options">
                                {showSingleOption && (
                                    <button
                                        className="update-option-btn update-single"
                                        onClick={handleUpdateSingle}
                                        disabled={isUpdating}
                                    >
                                        <div className="update-option-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 6v6l4 2" />
                                            </svg>
                                        </div>
                                        <div className="update-option-text">
                                            <h3>이 일정만 수정</h3>
                                            <p>선택한 날짜의 일정만 수정합니다</p>
                                        </div>
                                    </button>
                                )}

                                {showFromThisOption && (
                                    <button
                                        className="update-option-btn update-from-this"
                                        onClick={handleUpdateFromThis}
                                        disabled={isUpdating}
                                    >
                                        <div className="update-option-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                        </div>
                                        <div className="update-option-text">
                                            <h3>이 일정 이후 모두 수정</h3>
                                            <p>선택한 일정부터 이후의 모든 반복 일정을 수정합니다</p>
                                        </div>
                                    </button>
                                )}

                                {showRecurringOption && (
                                    <button
                                        className="update-option-btn update-all"
                                        onClick={handleUpdateRecurring}
                                        disabled={isUpdating}
                                    >
                                        <div className="update-option-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M4 12h8l-3-3m6 6h8l-3-3" />
                                                <path d="M4 6h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <div className="update-option-text">
                                            <h3>모든 반복 일정 수정</h3>
                                            <p>관련된 모든 반복 일정을 수정합니다</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="update-description">이 일정을 수정하시겠습니까?</p>
                            <div className="update-buttons">
                                <button
                                    className="confirm-update-btn"
                                    onClick={handleUpdateSingle}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "수정 중..." : "수정"}
                                </button>
                                <button className="cancel-update-btn" onClick={onClose}>
                                    취소
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
