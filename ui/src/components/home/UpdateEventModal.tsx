import React, { useState } from "react";
import { UpdateEventModalProps } from "@/lib/types/event.interface";
import { useUpdateEventForm } from "../../hooks/useUpdateEventForm";
import { useEventUpdateLogic } from "../../hooks/useEventUpdateLogic";
import { useEventDeleteLogic } from "../../hooks/useEventDeleteLogic";
import EventFormSection from "./EventFormSection";
import LocationSearchModal from "./LocationSearchModal";
import RecurringScheduleModal from "./RecurringScheduleModal";
import DeleteEventModal from "./DeleteEventModal";
import UpdateOptionsModal from "./UpdateOptionsModal";
import "./UpdateEventModal.css";

export default function UpdateEventModal({ isOpen, onClose, onEventUpdated, event }: UpdateEventModalProps) {
    // Modal states - 먼저 선언
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showUpdateOptionsModal, setShowUpdateOptionsModal] = useState(false);

    // Custom hooks for state management and logic
    const {
        formData,
        location,
        recurring,
        updateFormData,
        selectColor,
        handleLocationAdd,
        handleLocationRemove,
        handleRecurringApply,
        handleRecurringRemove,
        hasRecurringChanged,
    } = useUpdateEventForm({ event, isOpen });

    const { handleSubmit, handleUpdateSingle, handleUpdateRecurring, handleUpdateFromThis, isSubmitting } =
        useEventUpdateLogic({
            event,
            formData,
            location,
            recurring,
            onEventUpdated,
            onClose,
            setShowUpdateOptionsModal,
            hasRecurringChanged,
        });

    const {
        handleDelete,
        handleDeleteSingle,
        handleDeleteRecurring,
        handleDeleteFromThis,
        showDeleteModal,
        setShowDeleteModal,
    } = useEventDeleteLogic({ event, onEventUpdated, onClose });

    // Helper function to determine if "이 일정만" option should be shown
    const getShowSingleOption = () => {
        if (!event?.recurringEventId || !recurring) return false;

        // 반복 설정이 변경되었는지 확인하는 로직
        const hasRecurringChanged = () => {
            if (!event.recurringEventData || !recurring) return true;

            return (
                event.recurringEventData.rule !== recurring.rule ||
                event.recurringEventData.startDate !== recurring.startDate ||
                event.recurringEventData.endDate !== recurring.endDate
            );
        };

        // 반복 → 반복이면서, 반복 설정이 변경되지 않은 경우에만 "이 일정만" 옵션 표시
        const wasRecurring = !!event.recurringEventId;
        const willBeRecurring = !!recurring;

        return wasRecurring && willBeRecurring && !hasRecurringChanged();
    };

    const handleUpdateSingleWithClose = () => {
        setShowUpdateOptionsModal(false);
        handleUpdateSingle();
    };

    const handleUpdateRecurringWithClose = () => {
        setShowUpdateOptionsModal(false);
        handleUpdateRecurring();
    };

    const handleUpdateFromThisWithClose = () => {
        setShowUpdateOptionsModal(false);
        handleUpdateFromThis();
    };

    if (!isOpen || !event) return null;

    return (
        <div className="update-event-modal-overlay" onClick={onClose}>
            <div className="update-event-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>일정 수정</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="모달 닫기">
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
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    isSubmitting={isSubmitting}
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
                selectedDate={new Date(formData.startDate + "T00:00:00")}
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

            <DeleteEventModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDeleteSingle={handleDeleteSingle}
                onDeleteRecurring={handleDeleteRecurring}
                onDeleteFromThis={handleDeleteFromThis}
                isRecurring={!!event?.recurringEventId}
                eventTitle={event?.title || ""}
            />

            <UpdateOptionsModal
                isOpen={showUpdateOptionsModal}
                onClose={() => setShowUpdateOptionsModal(false)}
                onUpdateSingle={handleUpdateSingleWithClose}
                onUpdateRecurring={handleUpdateRecurringWithClose}
                onUpdateFromThis={handleUpdateFromThisWithClose}
                isRecurring={!!event?.recurringEventId}
                eventTitle={event?.title || ""}
                showSingleOption={getShowSingleOption()}
            />
        </div>
    );
}
