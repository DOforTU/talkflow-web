"use client";

import { useState, useEffect } from "react";
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
    existingRecurring?: CreateRecurringRuleDto | null;
}

export default function RecurringScheduleModal({
    isOpen,
    onClose,
    onApply,
    selectedDate,
    existingRecurring,
}: RecurringScheduleModalProps) {
    // 로컬 시간대 기준으로 날짜 문자열 생성
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 선택된 날짜의 요일을 기본값으로 설정
    const getDefaultWeekday = () => {
        return [selectedDate.getDay()]; // 0=일요일, 1=월요일, ..., 6=토요일
    };

    // RRULE을 파싱하는 함수
    const parseRRULE = (rrule: string): RecurringSettings => {
        const settings: RecurringSettings = {
            frequency: "WEEKLY",
            interval: 1,
            weekdays: getDefaultWeekday(),
        };

        // FREQ 파싱
        const freqMatch = rrule.match(/FREQ=(\w+)/);
        if (freqMatch) {
            settings.frequency = freqMatch[1] as RecurringFrequency;
        }

        // INTERVAL 파싱
        const intervalMatch = rrule.match(/INTERVAL=(\d+)/);
        if (intervalMatch) {
            settings.interval = parseInt(intervalMatch[1]);
        }

        // BYDAY 파싱 (WEEKLY인 경우)
        if (settings.frequency === "WEEKLY") {
            const bydayMatch = rrule.match(/BYDAY=([^;]+)/);
            if (bydayMatch) {
                const dayMap: { [key: string]: number } = {
                    SU: 0,
                    MO: 1,
                    TU: 2,
                    WE: 3,
                    TH: 4,
                    FR: 5,
                    SA: 6,
                };
                const days = bydayMatch[1].split(",");
                settings.weekdays = days
                    .map((day) => {
                        const mappedDay = dayMap[day.trim()];
                        // RRULE의 요일을 JavaScript Date 객체의 요일로 변환 (일요일=0)
                        return mappedDay !== undefined ? mappedDay : 0;
                    })
                    .sort();
            }
        }

        return settings;
    };

    const [recurringSettings, setRecurringSettings] = useState<RecurringSettings>({
        frequency: "WEEKLY",
        interval: 1,
        weekdays: getDefaultWeekday(),
    });

    // selectedDate가 변경되거나 기존 반복 설정이 있을 때 설정 업데이트
    useEffect(() => {
        if (isOpen) {
            if (existingRecurring && existingRecurring.rule) {
                // 기존 반복 설정이 있으면 파싱해서 사용
                const parsedSettings = parseRRULE(existingRecurring.rule);
                setRecurringSettings({
                    ...parsedSettings,
                    endDate: existingRecurring.endDate,
                });
            } else {
                // 기존 설정이 없으면 기본값 사용
                setRecurringSettings((prev) => ({
                    ...prev,
                    weekdays: getDefaultWeekday(),
                    endDate: undefined,
                }));
            }
        }
    }, [selectedDate, isOpen, existingRecurring]);

    const generateRRULE = (settings: RecurringSettings): string => {
        let rrule = `FREQ=${settings.frequency};INTERVAL=${settings.interval}`;

        if (settings.frequency === "WEEKLY" && settings.weekdays && settings.weekdays.length > 0) {
            const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            const convertedDays = settings.weekdays.map((day) => days[day]);
            const byDay = convertedDays.join(",");
            rrule += `;BYDAY=${byDay}`;
        }

        return rrule;
    };

    const updateRecurringSettings = (field: keyof RecurringSettings, value: any) => {
        setRecurringSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleWeekday = (day: number) => {
        setRecurringSettings((prev) => ({
            ...prev,
            weekdays: prev.weekdays?.includes(day)
                ? prev.weekdays.filter((d) => d !== day)
                : [...(prev.weekdays || []), day].sort(),
        }));
    };

    const handleApply = () => {
        const startDate = getLocalDateString(selectedDate);
        const rrule = generateRRULE(recurringSettings);

        // endDate가 없으면 자동으로 설정
        let endDate = recurringSettings.endDate;
        if (!endDate) {
            const selectedDateObj = new Date(selectedDate);
            if (recurringSettings.frequency === "YEARLY") {
                // 매년: 5년 후
                selectedDateObj.setFullYear(selectedDateObj.getFullYear() + 5);
            } else {
                // 그 외: 1년 후
                selectedDateObj.setFullYear(selectedDateObj.getFullYear() + 1);
            }
            endDate = getLocalDateString(selectedDateObj);
        }

        const recurringData: CreateRecurringRuleDto = {
            rule: rrule,
            startDate,
            endDate: endDate,
        };

        onApply(recurringData);
        onClose(); // 모달 닫기 추가
    };

    if (!isOpen) return null;

    return (
        <div className="recurring-modal-overlay" onClick={onClose}>
            <div className="recurring-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>반복 설정</h3>
                    <button className="modal-close-btn" onClick={onClose} aria-label="모달 닫기">
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
                                        className={`weekday-btn ${
                                            recurringSettings.weekdays?.includes(index) ? "selected" : ""
                                        }`}
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
                            min={getLocalDateString(selectedDate)}
                        />
                        {!recurringSettings.endDate && (
                            <div className="end-date-info">
                                <div className="info-text">
                                    {recurringSettings.frequency === "YEARLY" &&
                                        "⚠️ 종료일을 선택하지 않으면 5년간 총 5개의 일정이 생성됩니다."}
                                    {recurringSettings.frequency === "MONTHLY" &&
                                        "⚠️ 종료일을 선택하지 않으면 1년간 총 12개의 일정이 생성됩니다."}
                                    {recurringSettings.frequency === "WEEKLY" &&
                                        "⚠️ 종료일을 선택하지 않으면 1년간 총 52개의 일정이 생성됩니다."}
                                    {recurringSettings.frequency === "DAILY" &&
                                        "⚠️ 종료일을 선택하지 않으면 1년간 총 365개의 일정이 생성됩니다."}
                                </div>
                            </div>
                        )}
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
