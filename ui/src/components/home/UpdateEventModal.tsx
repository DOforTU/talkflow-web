"use client";

import { useState, useEffect } from "react";
import {
    UpdateLocationDto,
    UpdateRecurringRuleDto,
    CreateLocationDto,
    CreateRecurringRuleDto,
    ResponseEventDto,
    UpdateEventDto,
} from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import RecurringScheduleModal from "./RecurringScheduleModal";
import LocationSearchModal from "./LocationSearchModal";
import "./UpdateEventModal.css";

interface UpdateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventUpdated: () => void;
    event: ResponseEventDto | null;
}

const COLOR_OPTIONS = [
    "#EC4899", // Pink
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#06B6D4", // Cyan
    "#64748B", // Slate
];

export default function UpdateEventModal({ isOpen, onClose, onEventUpdated, event }: UpdateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isAllDay: false,
        startTime: "10:00",
        endTime: "12:00",
        colorCode: COLOR_OPTIONS[0],
    });
    const [location, setLocation] = useState<UpdateLocationDto | null>(null);
    const [recurring, setRecurring] = useState<UpdateRecurringRuleDto | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (event && isOpen) {
            const startDate = new Date(event.startTime.replace(" ", "T"));
            const endDate = new Date(event.endTime.replace(" ", "T"));

            setFormData({
                title: event.title,
                description: event.description || "",
                isAllDay: event.isAllDay,
                startTime: event.isAllDay ? "10:00" : startDate.toTimeString().slice(0, 5),
                endTime: event.isAllDay ? "12:00" : endDate.toTimeString().slice(0, 5),
                colorCode: event.colorCode,
            });

            // 업데이트 요청을 보내기 위해서 Response Type -> Update DTO Type으로 변환
            if (event.location) {
                setLocation({
                    nameEn: event.location.nameEn || undefined,
                    nameKo: event.location.nameKo || undefined,
                    address: event.location.address,
                    latitude: event.location.latitude,
                    longitude: event.location.longitude,
                });
            } else {
                setLocation(null);
            }

            if (event.recurringEvent) {
                setRecurring({
                    rule: event.recurringEvent.rule,
                    startDate: event.recurringEvent.startDate,
                    endDate: event.recurringEvent.endDate || undefined, // null을 undefined로 변환
                });
            } else {
                setRecurring(null);
            }
        }
    }, [event, isOpen]);

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const selectColor = (color: string) => {
        updateFormData("colorCode", color);
    };

    const handleLocationAdd = (locationData: CreateLocationDto) => {
        // CreateLocationDto를 UpdateLocationDto로 변환
        const updateLocationData: UpdateLocationDto = {
            nameEn: locationData.nameEn,
            nameKo: locationData.nameKo,
            address: locationData.address,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
        };
        setLocation(updateLocationData);
        setShowLocationModal(false);
    };

    const handleLocationRemove = () => {
        setLocation(null);
    };

    const handleRecurringApply = (recurringData: CreateRecurringRuleDto) => {
        // CreateRecurringRuleDto를 UpdateRecurringRuleDto로 변환
        const updateRecurringData: UpdateRecurringRuleDto = {
            rule: recurringData.rule,
            startDate: recurringData.startDate,
            endDate: recurringData.endDate,
        };
        setRecurring(updateRecurringData);
        setShowRecurringModal(false);
    };

    const handleRecurringRemove = () => {
        setRecurring(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !event) return;

        setIsSubmitting(true);

        try {
            const eventDate = new Date(event.startTime).toISOString().split("T")[0];

            let startTime, endTime;
            if (formData.isAllDay) {
                startTime = `${eventDate} 00:00`;
                endTime = `${eventDate} 23:59`;
            } else {
                startTime = `${eventDate} ${formData.startTime}`;
                endTime = `${eventDate} ${formData.endTime}`;
            }

            // 변경된 필드만 포함하여 UpdateEventDto 생성
            const updateEventDto: UpdateEventDto = {};

            // 기본 필드 비교 및 추가
            if (formData.title.trim() !== event.title) {
                updateEventDto.title = formData.title.trim();
            }

            const newDescription = formData.description.trim() || undefined;
            const oldDescription = event.description || undefined;
            if (newDescription !== oldDescription) {
                updateEventDto.description = newDescription;
            }

            if (startTime !== event.startTime) {
                updateEventDto.startTime = startTime;
            }

            if (endTime !== event.endTime) {
                updateEventDto.endTime = endTime;
            }

            if (formData.isAllDay !== event.isAllDay) {
                updateEventDto.isAllDay = formData.isAllDay;
            }

            if (formData.colorCode !== event.colorCode) {
                updateEventDto.colorCode = formData.colorCode;
            }

            // location 비교 (깊은 비교 필요)
            const hasLocationChanged = () => {
                if (!location && !event.location) return false;
                if (!location || !event.location) return true;

                return (
                    location.nameEn !== (event.location.nameEn || undefined) ||
                    location.nameKo !== (event.location.nameKo || undefined) ||
                    location.address !== event.location.address ||
                    location.latitude !== event.location.latitude ||
                    location.longitude !== event.location.longitude
                );
            };

            if (hasLocationChanged()) {
                updateEventDto.location = location || undefined;
            }

            // recurring 비교
            const hasRecurringChanged = () => {
                if (!recurring && !event.recurringEvent) return false;
                if (!recurring || !event.recurringEvent) return true;

                return (
                    recurring.rule !== event.recurringEvent.rule ||
                    recurring.startDate !== event.recurringEvent.startDate ||
                    recurring.endDate !== (event.recurringEvent.endDate || undefined)
                );
            };

            if (hasRecurringChanged()) {
                updateEventDto.recurring = recurring || undefined;
            }

            // 변경사항이 있을 때만 API 호출
            if (Object.keys(updateEventDto).length > 0) {
                await eventApi.updateEvent(event.id, updateEventDto);
                onEventUpdated();
            }

            handleClose();
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!event || !window.confirm("정말로 이 일정을 삭제하시겠습니까?")) return;

        setIsSubmitting(true);

        try {
            await eventApi.deleteEvent(event.id);
            onEventUpdated();
            handleClose();
        } catch (error) {
            console.error("Failed to delete event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: "",
            description: "",
            isAllDay: false,
            startTime: "10:00",
            endTime: "12:00",
            colorCode: COLOR_OPTIONS[0],
        });
        setLocation(null);
        setRecurring(null);
        onClose();
    };

    if (!isOpen || !event) return null;

    return (
        <div className="update-event-modal-overlay" onClick={handleClose}>
            <div className="update-event-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>일정 수정</h2>
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

                    {!formData.isAllDay && (
                        <div className="form-group time-group">
                            <div className="time-input-group">
                                <label htmlFor="startTime">시작 시간</label>
                                <input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => updateFormData("startTime", e.target.value)}
                                    required={!formData.isAllDay}
                                />
                            </div>
                            <div className="time-input-group">
                                <label htmlFor="endTime">종료 시간</label>
                                <input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => updateFormData("endTime", e.target.value)}
                                    required={!formData.isAllDay}
                                />
                            </div>
                        </div>
                    )}

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
                                    <span className="recurring-rule">
                                        {formatRecurringRule(recurring.rule || undefined)}
                                    </span>
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
                        <button type="button" className="delete-btn" onClick={handleDelete} disabled={isSubmitting}>
                            삭제
                        </button>
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            취소
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting || !formData.title.trim()}>
                            {isSubmitting ? "수정 중..." : "수정"}
                        </button>
                    </div>
                </form>
            </div>

            <LocationSearchModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationSelect={handleLocationAdd}
            />

            <RecurringScheduleModal
                isOpen={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
                onApply={handleRecurringApply}
                selectedDate={new Date(event.startTime)}
            />
        </div>
    );
}

function formatRecurringRule(rrule: string | undefined): string {
    if (!rrule) return "사용자 지정";
    if (rrule.includes("DAILY")) return "매일";
    if (rrule.includes("WEEKLY")) return "매주";
    if (rrule.includes("MONTHLY")) return "매월";
    if (rrule.includes("YEARLY")) return "매년";
    return "사용자 지정";
}
