"use client";

import { useState } from "react";
import "./DeleteEventModal.css";

interface DeleteEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeleteSingle: () => void;
    onDeleteRecurring: () => void;
    isRecurring: boolean;
    eventTitle: string;
}

export default function DeleteEventModal({
    isOpen,
    onClose,
    onDeleteSingle,
    onDeleteRecurring,
    isRecurring,
    eventTitle,
}: DeleteEventModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleDeleteSingle = async () => {
        setIsDeleting(true);
        try {
            await onDeleteSingle();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteRecurring = async () => {
        setIsDeleting(true);
        try {
            await onDeleteRecurring();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="delete-event-modal-overlay" onClick={onClose}>
            <div className="delete-event-modal" onClick={(e) => e.stopPropagation()}>
                <div className="delete-modal-header">
                    <h2>일정 삭제</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="모달 닫기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="delete-modal-content">
                    <div className="event-title-display">
                        <strong>"{eventTitle}"</strong>
                    </div>

                    {isRecurring ? (
                        <>
                            <p className="delete-description">이 일정은 반복 일정입니다. 어떻게 삭제하시겠습니까?</p>
                            <div className="delete-options">
                                <button
                                    className="delete-option-btn delete-single"
                                    onClick={handleDeleteSingle}
                                    disabled={isDeleting}
                                >
                                    <div className="delete-option-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <div className="delete-option-text">
                                        <h3>이 일정만 삭제</h3>
                                        <p>선택한 날짜의 일정만 삭제합니다</p>
                                    </div>
                                </button>

                                <button
                                    className="delete-option-btn delete-all"
                                    onClick={handleDeleteRecurring}
                                    disabled={isDeleting}
                                >
                                    <div className="delete-option-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M4 12h8l-3-3m6 6h8l-3-3" />
                                            <path d="M4 6h16M4 18h16" />
                                        </svg>
                                    </div>
                                    <div className="delete-option-text">
                                        <h3>모든 반복 일정 삭제</h3>
                                        <p>관련된 모든 반복 일정을 삭제합니다</p>
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="delete-description">이 일정을 삭제하시겠습니까?</p>
                            <div className="delete-buttons">
                                <button
                                    className="confirm-delete-btn"
                                    onClick={handleDeleteSingle}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "삭제 중..." : "삭제"}
                                </button>
                                <button className="cancel-delete-btn" onClick={onClose}>
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
