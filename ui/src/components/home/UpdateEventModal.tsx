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

    const {
        handleSubmit: handleSubmitLogic,
        handleUpdateSingle,
        handleUpdateRecurring,
        handleUpdateFromThis,
        isSubmitting,
    } = useEventUpdateLogic({
        event,
        formData,
        location,
        recurring,
        onEventUpdated,
        onClose,
        setShowUpdateOptionsModal,
        hasRecurringChanged,
    });

    // 커스텀 handleSubmit: 옵션 모달을 보여줄지 결정
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const options = getUpdateOptions();

        if (!options.shouldShowModal) {
            // 모달 없이 직접 처리
            await handleSubmitLogic(e);
        } else {
            // 옵션 모달 표시
            setShowUpdateOptionsModal(true);
        }
    };

    const {
        handleDelete,
        handleDeleteSingle,
        handleDeleteRecurring,
        handleDeleteFromThis,
        showDeleteModal,
        setShowDeleteModal,
    } = useEventDeleteLogic({ event, onEventUpdated, onClose });

    // Helper functions to determine update options
    const getUpdateOptions = () => {
        const wasRecurring = !!event?.recurringEventId;
        const willBeRecurring = !!recurring && !!recurring.rule && !!recurring.startDate;

        // Case 1: 단일 → 단일 (모달 안 보여줌)
        if (!wasRecurring && !willBeRecurring) {
            return { shouldShowModal: false };
        }

        // Case 2: 단일 → 반복 (모달 안 보여줌)
        if (!wasRecurring && willBeRecurring) {
            return { shouldShowModal: false };
        }

        // Case 3: 반복 → 단일 (모달 안 보여줌)
        if (wasRecurring && !willBeRecurring) {
            return { shouldShowModal: false };
        }

        // Case 4: 반복 → 반복
        if (wasRecurring && willBeRecurring) {
            const recurringChanged = hasRecurringChanged();

            if (!recurringChanged) {
                // 반복 설정 변경 안함: 모든 옵션 표시
                return {
                    shouldShowModal: true,
                    showSingleOption: true,
                    showRecurringOption: true,
                    showFromThisOption: true,
                };
            } else {
                // 반복 설정 변경됨: "관련 일정 모두", "이 일정 이후"만 표시
                return {
                    shouldShowModal: true,
                    showSingleOption: false,
                    showRecurringOption: true,
                    showFromThisOption: true,
                };
            }
        }

        return { shouldShowModal: false };
    };

    // 기존 함수 유지 (하위 호환성)
    const getShowSingleOption = () => {
        const options = getUpdateOptions();
        return options.showSingleOption || false;
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
                    mode="update"
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
                showSingleOption={getUpdateOptions().showSingleOption || false}
                showRecurringOption={getUpdateOptions().showRecurringOption || false}
                showFromThisOption={getUpdateOptions().showFromThisOption || false}
            />
        </div>
    );
}
