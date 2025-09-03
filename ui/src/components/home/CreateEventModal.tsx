"use client";

import { useState, useEffect } from "react";
import { CreateEventDto, CreateLocationDto, CreateRecurringRuleDto } from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import { getLocalDateString } from "@/lib/utils/dateUtils";
import {
    COLOR_OPTIONS,
    validateAndAdjustDateTime,
    createDefaultFormData,
    formatRecurringRule,
} from "@/lib/utils/eventFormUtils";
import RecurringScheduleModal from "./RecurringScheduleModal";
import LocationSearchModal from "./LocationSearchModal";
import "./CreateEventModal.css";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
    selectedDate: Date;
}

export default function CreateEventModal({ isOpen, onClose, onEventCreated, selectedDate }: CreateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isAllDay: false,
        startDate: getLocalDateString(selectedDate),
        startTime: "10:00",
        endDate: getLocalDateString(selectedDate),
        endTime: "12:00",
        colorCode: COLOR_OPTIONS[0],
    });
    const [location, setLocation] = useState<CreateLocationDto | null>(null);
    const [recurring, setRecurring] = useState<CreateRecurringRuleDto | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // selectedDate가 변경될 때 날짜 필드 업데이트
    useEffect(() => {
        if (isOpen) {
            const dateStr = getLocalDateString(selectedDate);
            setFormData((prev) => ({
                ...prev,
                startDate: dateStr,
                endDate: dateStr,
            }));
        }
    }, [selectedDate, isOpen]);

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            // 끝나는 시간이 시작 시간보다 빠르지 않도록 조정
            if (field === "startDate" || field === "startTime" || field === "endDate" || field === "endTime") {
                const adjustment = validateAndAdjustDateTime({
                    startDate: newData.startDate,
                    startTime: newData.startTime,
                    endDate: newData.endDate,
                    endTime: newData.endTime,
                });
                newData.endDate = adjustment.endDate;
                newData.endTime = adjustment.endTime;
            }

            return newData;
        });
    };

    const selectColor = (color: string) => {
        updateFormData("colorCode", color);
    };

    const handleLocationAdd = (locationData: CreateLocationDto) => {
        setLocation(locationData);
        setShowLocationModal(false);
    };

    const handleLocationRemove = () => {
        setLocation(null);
    };

    const handleRecurringApply = (recurringData: CreateRecurringRuleDto) => {
        setRecurring(recurringData);
        setShowRecurringModal(false);
    };

    const handleRecurringRemove = () => {
        setRecurring(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        setIsSubmitting(true);

        try {
            let startTime, endTime;
            if (formData.isAllDay) {
                // 하루 종일
                startTime = `${formData.startDate} 00:00`;
                endTime = `${formData.endDate} 23:59`;
            } else {
                startTime = `${formData.startDate} ${formData.startTime}`;
                endTime = `${formData.endDate} ${formData.endTime}`;
            }

            const createEventDto: CreateEventDto = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                startTime,
                endTime,
                isAllDay: formData.isAllDay,
                colorCode: formData.colorCode,
                location: location || undefined,
                recurring: recurring || undefined,
            };

            await eventApi.createEvent(createEventDto);
            onEventCreated();
            handleClose();
        } catch (error) {
            console.error("Failed to create event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        const dateStr = getLocalDateString(selectedDate);
        setFormData(createDefaultFormData(dateStr));
        setLocation(null);
        setRecurring(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="create-event-modal-overlay" onClick={handleClose}>
            <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>일정 생성</h2>
                    <button className="modal-close-btn" onClick={handleClose} aria-label="모달 닫기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
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

                    <div className="form-group datetime-group">
                        <div className="datetime-row">
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
                        <div className="datetime-row">
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

                    <div className="form-group">
                        <label>위치</label>
                        {location ? (
                            <div className="location-display">
                                <div className="location-info">
                                    <span className="location-name">{location.nameKo || location.nameEn}</span>
                                    <span className="location-address">{location.address}</span>
                                </div>
                                <button type="button" className="location-remove-btn" onClick={handleLocationRemove}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="location-add-btn"
                                onClick={() => setShowLocationModal(true)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>위치 추가</span>
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label>반복</label>
                        {recurring ? (
                            <div
                                className="recurring-display"
                                onClick={() => setShowRecurringModal(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="recurring-info">
                                    <span className="recurring-rule">{formatRecurringRule(recurring.rule)}</span>
                                </div>
                                <button
                                    type="button"
                                    className="recurring-remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRecurringRemove();
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="recurring-add-btn"
                                onClick={() => setShowRecurringModal(true)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M16 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                                    <polyline points="16,2 16,6 20,6" />
                                </svg>
                                <span>반복 설정</span>
                            </button>
                        )}
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            취소
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting || !formData.title.trim()}>
                            {isSubmitting ? "생성 중..." : "생성"}
                        </button>
                    </div>
                </form>
            </div>

            <LocationSearchModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationSelect={handleLocationAdd}
                existingLocation={location}
            />

            <RecurringScheduleModal
                isOpen={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
                onApply={handleRecurringApply}
                selectedDate={selectedDate}
                existingRecurring={
                    recurring
                        ? {
                              rule: recurring.rule || "",
                              startDate: recurring.startDate || "",
                              endDate: recurring.endDate,
                          }
                        : null
                }
            />
        </div>
    );
}
