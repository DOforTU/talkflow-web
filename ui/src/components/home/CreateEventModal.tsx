"use client";

import { useState } from "react";
import { CreateEventDto, CreateLocationDto, CreateRecurringRuleDto } from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import "./CreateEventModal.css";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
    selectedDate: Date;
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

type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface RecurringSettings {
    frequency: RecurringFrequency;
    interval: number;
    weekdays?: number[]; // 0=일요일, 1=월요일, ...
    endDate?: string;
}

export default function CreateEventModal({ isOpen, onClose, onEventCreated, selectedDate }: CreateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isAllDay: false,
        startTime: "10:00",
        endTime: "12:00",
        colorCode: COLOR_OPTIONS[0],
    });
    const [location, setLocation] = useState<CreateLocationDto | null>(null);
    const [recurring, setRecurring] = useState<CreateRecurringRuleDto | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [recurringSettings, setRecurringSettings] = useState<RecurringSettings>({
        frequency: "WEEKLY",
        interval: 1,
        weekdays: [1], // 기본값: 월요일
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setLocation(locationData);
        setShowLocationModal(false);
    };

    const handleLocationRemove = () => {
        setLocation(null);
    };

    const generateRRULE = (settings: RecurringSettings): string => {
        let rrule = `FREQ=${settings.frequency};INTERVAL=${settings.interval}`;
        
        if (settings.frequency === "WEEKLY" && settings.weekdays && settings.weekdays.length > 0) {
            const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            const convertedDays = settings.weekdays.map(day => {
                // 하루씩 당기기: 화목토 → 월수금
                const adjustedDay = (day + 6) % 7;
                return days[adjustedDay];
            });
            const byDay = convertedDays.join(",");
            rrule += `;BYDAY=${byDay}`;
        }
        
        return rrule;
    };

    const handleRecurringApply = () => {
        const startDate = selectedDate.toISOString().split("T")[0];
        const rrule = generateRRULE(recurringSettings);
        
        const recurringData: CreateRecurringRuleDto = {
            rule: rrule,
            startDate,
            endDate: recurringSettings.endDate,
        };
        
        setRecurring(recurringData);
        setShowRecurringModal(false);
    };

    const handleRecurringRemove = () => {
        setRecurring(null);
    };

    const updateRecurringSettings = (field: keyof RecurringSettings, value: any) => {
        setRecurringSettings(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleWeekday = (day: number) => {
        setRecurringSettings(prev => ({
            ...prev,
            weekdays: prev.weekdays?.includes(day) 
                ? prev.weekdays.filter(d => d !== day)
                : [...(prev.weekdays || []), day].sort()
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        setIsSubmitting(true);

        try {
            const dateStr = selectedDate.toISOString().split("T")[0];

            let startTime, endTime;
            if (formData.isAllDay) {
                startTime = `${dateStr} 00:00`;
                endTime = `${dateStr} 23:59`;
            } else {
                startTime = `${dateStr} ${formData.startTime}`;
                endTime = `${dateStr} ${formData.endTime}`;
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
        setRecurringSettings({
            frequency: "WEEKLY",
            interval: 1,
            weekdays: [1],
        });
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

                    {/* <div className="form-group">
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
                    </div> */}

                    <div className="form-group">
                        <label>반복</label>
                        {recurring ? (
                            <div className="recurring-display">
                                <div className="recurring-info">
                                    <span className="recurring-rule">{formatRecurringRule(recurring.rule)}</span>
                                    <span className="recurring-dates">
                                        {recurring.startDate} - {recurring.endDate || "무제한"}
                                    </span>
                                </div>
                                <button type="button" className="recurring-remove-btn" onClick={handleRecurringRemove}>
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

            {showLocationModal && (
                <div className="location-modal-placeholder">
                    <p>위치 추가 모달은 추후 구현 예정입니다.</p>
                    <button onClick={() => setShowLocationModal(false)}>닫기</button>
                </div>
            )}

            {showRecurringModal && (
                <div className="recurring-modal-overlay" onClick={() => setShowRecurringModal(false)}>
                    <div className="recurring-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>반복 설정</h3>
                            <button 
                                className="modal-close-btn" 
                                onClick={() => setShowRecurringModal(false)}
                                aria-label="모달 닫기"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="recurring-content">
                            <div className="form-group">
                                <label>반복 빈도</label>
                                <select 
                                    value={recurringSettings.frequency} 
                                    onChange={(e) => updateRecurringSettings("frequency", e.target.value as RecurringFrequency)}
                                >
                                    <option value="DAILY">매일</option>
                                    <option value="WEEKLY">매주</option>
                                    <option value="MONTHLY">매월</option>
                                    <option value="YEARLY">매년</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>간격</label>
                                <div className="interval-group">
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={recurringSettings.interval}
                                        onChange={(e) => updateRecurringSettings("interval", parseInt(e.target.value))}
                                    />
                                    <span>
                                        {recurringSettings.frequency === "DAILY" && "일마다"}
                                        {recurringSettings.frequency === "WEEKLY" && "주마다"}
                                        {recurringSettings.frequency === "MONTHLY" && "월마다"}
                                        {recurringSettings.frequency === "YEARLY" && "년마다"}
                                    </span>
                                </div>
                            </div>

                            {recurringSettings.frequency === "WEEKLY" && (
                                <div className="form-group">
                                    <label>요일 선택</label>
                                    <div className="weekday-selector">
                                        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`weekday-btn ${recurringSettings.weekdays?.includes(index) ? "selected" : ""}`}
                                                onClick={() => toggleWeekday(index)}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>종료 날짜 (선택사항)</label>
                                <input
                                    type="date"
                                    value={recurringSettings.endDate || ""}
                                    onChange={(e) => updateRecurringSettings("endDate", e.target.value || undefined)}
                                    min={selectedDate.toISOString().split("T")[0]}
                                />
                            </div>

                            <div className="recurring-buttons">
                                <button type="button" onClick={() => setShowRecurringModal(false)}>
                                    취소
                                </button>
                                <button type="button" onClick={handleRecurringApply}>
                                    적용
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatRecurringRule(rrule: string): string {
    if (rrule.includes("DAILY")) return "매일";
    if (rrule.includes("WEEKLY")) return "매주";
    if (rrule.includes("MONTHLY")) return "매월";
    if (rrule.includes("YEARLY")) return "매년";
    return "사용자 지정";
}
