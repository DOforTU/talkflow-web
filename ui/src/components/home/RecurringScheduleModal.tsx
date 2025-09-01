"use client";

import { useState } from "react";
import { CreateRecurringRuleDto } from "@/lib/types/event.interface";
import "./RecurringScheduleModal.css";

type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface RecurringSettings {
    frequency: RecurringFrequency;
    interval: number;
    weekdays?: number[];
    endDate?: string;
}

interface RecurringScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (recurring: CreateRecurringRuleDto) => void;
    selectedDate: Date;
}

export default function RecurringScheduleModal({ 
    isOpen, 
    onClose, 
    onApply, 
    selectedDate 
}: RecurringScheduleModalProps) {
    const [recurringSettings, setRecurringSettings] = useState<RecurringSettings>({
        frequency: "WEEKLY",
        interval: 1,
        weekdays: [1],
    });

    const generateRRULE = (settings: RecurringSettings): string => {
        let rrule = `FREQ=${settings.frequency};INTERVAL=${settings.interval}`;
        
        if (settings.frequency === "WEEKLY" && settings.weekdays && settings.weekdays.length > 0) {
            const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            const convertedDays = settings.weekdays.map(day => {
                const adjustedDay = (day + 6) % 7;
                return days[adjustedDay];
            });
            const byDay = convertedDays.join(",");
            rrule += `;BYDAY=${byDay}`;
        }
        
        return rrule;
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

    const handleApply = () => {
        const startDate = selectedDate.toISOString().split("T")[0];
        const rrule = generateRRULE(recurringSettings);
        
        const recurringData: CreateRecurringRuleDto = {
            rule: rrule,
            startDate,
            endDate: recurringSettings.endDate,
        };
        
        onApply(recurringData);
    };

    if (!isOpen) return null;

    return (
        <div className="recurring-modal-overlay" onClick={onClose}>
            <div className="recurring-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>반복 설정</h3>
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
                        <button type="button" onClick={onClose}>
                            취소
                        </button>
                        <button type="button" onClick={handleApply}>
                            적용
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}