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
import EventFormSection from "./EventFormSection";
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

                <EventFormSection
                    formData={formData}
                    location={location}
                    recurring={recurring}
                    updateFormData={updateFormData}
                    selectColor={selectColor}
                    handleLocationAdd={handleLocationAdd}
                    handleLocationRemove={handleLocationRemove}
                    handleRecurringApply={handleRecurringApply}
                    handleRecurringRemove={handleRecurringRemove}
                    setShowLocationModal={setShowLocationModal}
                    setShowRecurringModal={setShowRecurringModal}
                    onSubmit={handleSubmit}
                    onClose={handleClose}
                    isSubmitting={isSubmitting}
                    mode="create"
                />
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
