import { useState } from "react";
import { ResponseEventDto } from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";

interface UseEventDeleteLogicProps {
    event: ResponseEventDto | null;
    onEventUpdated: () => void;
    onClose: () => void;
}

export const useEventDeleteLogic = ({ event, onEventUpdated, onClose }: UseEventDeleteLogicProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteSingle = async () => {
        if (!event) return;

        try {
            await eventApi.deleteSingleEvent(event.id);
            onEventUpdated();
            setShowDeleteModal(false);
            onClose();
        } catch (error) {
            console.error("Failed to delete single event:", error);
        }
    };

    const handleDeleteRecurring = async () => {
        if (!event) return;

        try {
            await eventApi.deleteRecurringEvents(event.id);
            onEventUpdated();
            setShowDeleteModal(false);
            onClose();
        } catch (error) {
            console.error("Failed to delete recurring events:", error);
        }
    };

    const handleDeleteFromThis = async () => {
        if (!event) return;

        try {
            await eventApi.deleteEventsFromThis(event.id);
            onEventUpdated();
            setShowDeleteModal(false);
            onClose();
        } catch (error) {
            console.error("Failed to delete events from this:", error);
        }
    };

    return {
        handleDelete,
        handleDeleteSingle,
        handleDeleteRecurring,
        handleDeleteFromThis,
        showDeleteModal,
        setShowDeleteModal,
    };
};
