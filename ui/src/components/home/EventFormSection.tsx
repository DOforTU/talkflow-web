import React from "react";
import {
    UpdateLocationDto,
    UpdateRecurringRuleDto,
    CreateLocationDto,
    CreateRecurringRuleDto,
} from "@/lib/types/event.interface";
import { COLOR_OPTIONS, formatRecurringRule } from "@/lib/utils/eventFormUtils";

interface FormData {
    title: string;
    description: string;
    isAllDay: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    colorCode: string;
}

interface EventFormSectionProps {
    formData: FormData;
    location: UpdateLocationDto | CreateLocationDto | null;
    recurring: UpdateRecurringRuleDto | CreateRecurringRuleDto | null;
    updateFormData: (field: string, value: string | boolean) => void;
    selectColor: (color: string) => void;
    handleLocationAdd: (location: CreateLocationDto) => void;
    handleLocationRemove: () => void;
    handleRecurringApply: (recurring: CreateRecurringRuleDto) => void;
    handleRecurringRemove: () => void;
    setShowLocationModal: (show: boolean) => void;
    setShowRecurringModal: (show: boolean) => void;
    onDelete?: () => void; // Optional for create modal
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isSubmitting: boolean;
    mode: "create" | "update"; // To determine button text and functionality
}

export default function EventFormSection({
    formData,
    location,
    recurring,
    updateFormData,
    selectColor,
    handleLocationAdd,
    handleLocationRemove,
    handleRecurringApply,
    handleRecurringRemove,
    setShowLocationModal,
    setShowRecurringModal,
    onDelete,
    onSubmit,
    onClose,
    isSubmitting,
    mode,
}: EventFormSectionProps) {
    return (
        <form onSubmit={onSubmit} className="event-form">
            {/* 제목 입력 */}
            <div className="form-group">
                <label htmlFor="title">제목 *</label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="일정 제목을 입력하세요"
                    required
                />
            </div>

            {/* 설명 입력 */}
            <div className="form-group">
                <label htmlFor="description">설명</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="일정 설명을 입력하세요 (선택사항)"
                    rows={3}
                />
            </div>

            {/* 하루종일 체크박스 */}
            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={formData.isAllDay}
                        onChange={(e) => updateFormData("isAllDay", e.target.checked)}
                    />
                    <span className="checkbox-text">하루종일</span>
                </label>
            </div>

            {/* 날짜 시간 입력 */}
            <div className="form-group datetime-group">
                <div className="datetime-columns">
                    <div className="datetime-column">
                        <div className="datetime-input-group">
                            <label htmlFor="startDate">시작 날짜</label>
                            <input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => updateFormData("startDate", e.target.value)}
                                required
                            />
                        </div>
                        {!formData.isAllDay && (
                            <div className="datetime-input-group">
                                <label htmlFor="startTime">시작 시간</label>
                                <input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => updateFormData("startTime", e.target.value)}
                                    required={!formData.isAllDay}
                                />
                            </div>
                        )}
                    </div>
                    <div className="datetime-column">
                        <div className="datetime-input-group">
                            <label htmlFor="endDate">종료 날짜</label>
                            <input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => updateFormData("endDate", e.target.value)}
                                required
                            />
                        </div>
                        {!formData.isAllDay && (
                            <div className="datetime-input-group">
                                <label htmlFor="endTime">종료 시간</label>
                                <input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => updateFormData("endTime", e.target.value)}
                                    required={!formData.isAllDay}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 색상 선택 */}
            <div className="form-group">
                <label>색상</label>
                <div className="color-picker">
                    {COLOR_OPTIONS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className={`color-option ${formData.colorCode === color ? "selected" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() => selectColor(color)}
                            aria-label={`색상 ${color} 선택`}
                        >
                            {formData.colorCode === color && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="white">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 위치 설정 */}
            <div className="form-group">
                <label>위치</label>
                {location ? (
                    <div
                        className="location-display"
                        onClick={() => setShowLocationModal(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="location-info">
                            <div className="location-name">{location.nameKo || location.nameEn || "위치"}</div>
                            <div className="location-address">{location.address}</div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLocationRemove();
                            }}
                            className="location-remove-btn"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setShowLocationModal(true)} className="location-add-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        위치 추가
                    </button>
                )}
            </div>

            {/* 반복 설정 */}
            <div className="form-group">
                <label>반복</label>
                {recurring ? (
                    <div
                        className="recurring-display"
                        onClick={() => setShowRecurringModal(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="recurring-info">
                            <div className="recurring-rule">{formatRecurringRule(recurring.rule || "")}</div>
                            <div className="recurring-dates">
                                {recurring.startDate}
                                {recurring.endDate && ` ~ ${recurring.endDate}`}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRecurringRemove();
                            }}
                            className="recurring-remove-btn"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setShowRecurringModal(true)} className="recurring-add-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M16 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                            <polyline points="16,2 16,6 20,6" />
                        </svg>
                        반복 설정
                    </button>
                )}
            </div>

            {/* 버튼 */}
            <div className="form-buttons">
                {mode === "update" && onDelete && (
                    <button type="button" onClick={onDelete} className="delete-btn" disabled={isSubmitting}>
                        삭제
                    </button>
                )}
                <button type="button" onClick={onClose} className="cancel-btn">
                    취소
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting || !formData.title.trim()}>
                    {isSubmitting
                        ? mode === "create"
                            ? "생성 중..."
                            : "수정 중..."
                        : mode === "create"
                        ? "생성"
                        : "수정"}
                </button>
            </div>
        </form>
    );
}
