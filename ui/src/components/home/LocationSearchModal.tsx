"use client";

import { CreateLocationDto } from "@/lib/types/event.interface";
import "./LocationSearchModal.css";

interface LocationSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: CreateLocationDto) => void;
}

export default function LocationSearchModal({ 
    isOpen, 
    onClose, 
    onLocationSelect 
}: LocationSearchModalProps) {
    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>위치 검색</h3>
                    <button 
                        className="modal-close-btn" 
                        onClick={onClose}
                        aria-label="모달 닫기"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="location-content">
                    <div className="location-modal-placeholder">
                        <p>위치 검색 기능은 추후 구현 예정입니다.</p>
                        <button onClick={onClose} className="placeholder-close-btn">닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}