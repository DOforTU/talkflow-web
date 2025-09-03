"use client";

import { useState, useEffect } from "react";
import {
    UpdateLocationDto,
    UpdateRecurringRuleDto,
    CreateLocationDto,
    CreateRecurringRuleDto,
    ResponseEventDto,
    UpdateEventDto,
    ResponseRecurringEventDto,
} from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import { getLocalDateString } from "@/lib/utils/dateUtils";
import { COLOR_OPTIONS, formatRecurringRule } from "@/lib/utils/eventFormUtils";
import RecurringScheduleModal from "./RecurringScheduleModal";
import LocationSearchModal from "./LocationSearchModal";
import DeleteEventModal from "./DeleteEventModal";
import UpdateOptionsModal from "./UpdateOptionsModal";
import "./UpdateEventModal.css";

interface UpdateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventUpdated: () => void;
    event: ResponseEventDto | null;
}

export default function UpdateEventModal({ isOpen, onClose, onEventUpdated, event }: UpdateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isAllDay: false,
        startDate: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endDate: new Date().toISOString().split("T")[0],
        endTime: "12:00",
        colorCode: COLOR_OPTIONS[0],
    });
    const [location, setLocation] = useState<UpdateLocationDto | null>(null);
    const [recurring, setRecurring] = useState<UpdateRecurringRuleDto | null>(null);
    const [recurringEventData, setRecurringEventData] = useState<ResponseRecurringEventDto | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateOptionsModal, setShowUpdateOptionsModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (event && isOpen) {
            // 시간대 변환 문제를 피하기 위해 문자열 직접 파싱
            const [startDateStr, startTimeStr] = event.startTime.split(" ");
            const [endDateStr, endTimeStr] = event.endTime.split(" ");

            setFormData({
                title: event.title,
                description: event.description || "",
                isAllDay: event.isAllDay,
                startDate: startDateStr, // 직접 날짜 문자열 사용
                startTime: event.isAllDay ? "10:00" : startTimeStr,
                endDate: endDateStr, // 직접 날짜 문자열 사용
                endTime: event.isAllDay ? "12:00" : endTimeStr,
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

            // recurringEventId가 있는 경우에만 반복 일정 데이터 조회
            if (event.recurringEventId) {
                eventApi
                    .getRecurringEventById(event.recurringEventId)
                    .then((data) => {
                        setRecurringEventData(data);
                        setRecurring({
                            rule: data.rule,
                            startDate: data.startDate,
                            endDate: data.endDate || undefined,
                        });
                    })
                    .catch((error) => {
                        console.error("Failed to fetch recurring event:", error);
                        setRecurringEventData(null);
                        setRecurring(null);
                    });
            } else {
                setRecurringEventData(null);
                setRecurring(null);
            }
        }
    }, [event, isOpen]);

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            // 끝나는 시간이 시작 시간보다 빠르지 않도록 조정
            if (field === "startDate" || field === "startTime" || field === "endDate" || field === "endTime") {
                const startDateTime = new Date(`${newData.startDate}T${newData.startTime}`);
                const endDateTime = new Date(`${newData.endDate}T${newData.endTime}`);

                if (endDateTime <= startDateTime) {
                    // 끝 시간이 시작 시간보다 빠르면, 끝 시간을 시작 시간과 같도록 설정
                    newData.endDate = newData.startDate;
                    newData.endTime = newData.startTime;
                }
            }

            return newData;
        });
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

        const wasRecurring = !!event.recurringEventId;
        const willBeRecurring = !!recurring;

        // Case 1: 단일 → 단일 - 바로 업데이트
        if (!wasRecurring && !willBeRecurring) {
            await performSmartUpdate("single");
            return;
        }

        // Case 2: 단일 → 반복 - 바로 업데이트
        if (!wasRecurring && willBeRecurring) {
            await performSmartUpdate("single"); // 삭제 후 생성
            return;
        }

        // Case 3: 반복 → 단일 - 바로 업데이트
        if (wasRecurring && !willBeRecurring) {
            await performSmartUpdate("single"); // 삭제 후 생성
            return;
        }

        // Case 4,5: 반복 → 반복 - 조건에 따라 옵션 표시
        if (wasRecurring && willBeRecurring) {
            // 반복 rule이나 날짜가 변경된 경우: 2개 옵션만 ("관련 일정 모두", "이 일정 이후")
            if (hasRecurringChanged()) {
                setShowUpdateOptionsModal(true);
                return;
            }

            // 반복 설정은 그대로이고 event 정보만 변경: 3개 옵션 모두 ("이 일정만", "관련 일정 모두", "이 일정 이후")
            setShowUpdateOptionsModal(true);
            return;
        }
    };

    // recurring 데이터가 변경되었는지 확인
    const hasRecurringChanged = () => {
        if (!recurring && !recurringEventData) return false;
        if (!recurring || !recurringEventData) return true;

        return (
            recurring.rule !== recurringEventData.rule ||
            recurring.startDate !== recurringEventData.startDate ||
            recurring.endDate !== (recurringEventData.endDate || undefined)
        );
    };

    // "이 일정만 수정" 옵션을 보여줄지 결정
    const getShowSingleOption = () => {
        if (!event?.recurringEventId || !recurring) return false;

        // 반복 → 반복이면서, 반복 설정이 변경되지 않은 경우에만 "이 일정만" 옵션 표시
        const wasRecurring = !!event.recurringEventId;
        const willBeRecurring = !!recurring;

        return wasRecurring && willBeRecurring && !hasRecurringChanged();
    };

    const performUpdate = async (isRecurring: boolean) => {
        if (!event) return;

        setIsSubmitting(true);

        try {
            let startTime, endTime;
            if (formData.isAllDay) {
                startTime = `${formData.startDate} 00:00`;
                endTime = `${formData.endDate} 23:59`;
            } else {
                startTime = `${formData.startDate} ${formData.startTime}`;
                endTime = `${formData.endDate} ${formData.endTime}`;
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
                if (!recurring && !recurringEventData) return false;
                if (!recurring || !recurringEventData) return true;

                return (
                    recurring.rule !== recurringEventData.rule ||
                    recurring.startDate !== recurringEventData.startDate ||
                    recurring.endDate !== (recurringEventData.endDate || undefined)
                );
            };

            if (hasRecurringChanged()) {
                updateEventDto.recurring = recurring || undefined;
            }

            // 변경사항이 있을 때만 API 호출
            if (Object.keys(updateEventDto).length > 0) {
                if (isRecurring) {
                    await eventApi.updateRecurringEvents(event.id, updateEventDto);
                } else {
                    await eventApi.updateEvent(event.id, updateEventDto);
                }
                onEventUpdated();
            }

            handleClose();
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSingle = async () => {
        setShowUpdateOptionsModal(false);
        await performSmartUpdate("single");
    };

    const handleUpdateRecurring = async () => {
        setShowUpdateOptionsModal(false);
        await performSmartUpdate("recurring");
    };

    const handleUpdateFromThis = async () => {
        setShowUpdateOptionsModal(false);
        await performSmartUpdate("from-this");
    };

    const performSmartUpdate = async (updateType: "single" | "recurring" | "from-this") => {
        if (!event) return;

        setIsSubmitting(true);

        try {
            let startTime, endTime;
            if (formData.isAllDay) {
                startTime = `${formData.startDate} 00:00`;
                endTime = `${formData.endDate} 23:59`;
            } else {
                startTime = `${formData.startDate} ${formData.startTime}`;
                endTime = `${formData.endDate} ${formData.endTime}`;
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
            if (hasRecurringChanged()) {
                updateEventDto.recurring = recurring || undefined;
            }

            // 변경사항이 있을 때만 API 호출
            if (Object.keys(updateEventDto).length > 0) {
                await eventApi.smartUpdate(event.id, updateEventDto, updateType);
                onEventUpdated();
            }

            handleClose();
        } catch (error) {
            console.error("Failed to smart update event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteSingle = async () => {
        if (!event) return;

        try {
            await eventApi.deleteSingleEvent(event.id);
            onEventUpdated();
            setShowDeleteModal(false);
            handleClose();
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
            handleClose();
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
            handleClose();
        } catch (error) {
            console.error("Failed to delete events from this:", error);
        }
    };

    const handleClose = () => {
        const today = getLocalDateString(new Date());
        setFormData({
            title: "",
            description: "",
            isAllDay: false,
            startDate: today,
            startTime: "10:00",
            endDate: today,
            endTime: "12:00",
            colorCode: COLOR_OPTIONS[0],
        });
        setLocation(null);
        setRecurring(null);
        onClose();
    };

    if (!isOpen || !event) return null;

    /**
     * 기존에 단일 일정이었고, 업데이트도 단일 일정인경우(기존 데이터 반복 일정 NULL, 업데이트 DTO 반복 undefined인 경우)
     * - "이 일정만/관련 일정 모두/이 일정 이후" 보여주지 않고, 바로 updateSingleEvent 호출
     *
     * 기존에 단일 일정이었고, 업데이트는 반복 일정인 경우(기존 데이터 반복 일정 NULL, 업데이트 DTO 반복 존재하는 경우)
     * - "이 일정만/관련 일정 모두/이 일정 이후" 보여주지 않고 바로 업데이트: 기존 일정 삭제 후, 업데이트 DTO -> CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성
     *
     * 기존에 반복 일정이었고, 업데이트는 단일 일정인 경우
     * - "이 일정만/관련 일정 모두/이 일정 이후" 보여주지 않고 바로 업데이트: 기존 반복 일정 모두 삭제 후, 업데이트 DTO -> CreateEventDto 타입으로 변환 후 새로운 단일 일정 생성
     *
     * 기존에 반복 일정이었고, 업데이트도 반복 일정인 경우(기존 데이터 반복 일정 존재, 업데이트 DTO 반복 존재하는 경우)
     * - 반복 이벤트를 아예 수정하지 않은 경우(= event 정보만 수정한 경우):
     *      - "이 일정만/관련 일정 모두/이 일정 이후" 모두 보여줌
     *          - 이 일정만 수정인 경우: updateSingleEvent 호출, recurringEventId => null로 변경(단일 이벤트 취급)
     *          - 관련 일정 모두 수정인 경우: updateManyEventsByRecurringEventId 호출
     *              - updateManyEventsByRecurringEventId: 파라미터로 받은 recurringEventId를 가진 모든 일정 수정
     *                      반복 패턴은 수정이 아니므로 삭제후 생성보다 업데이트가 좋을듯...
     *          - 이 일정 이후 수정인 경우: 이 일정 이후 삭제 후, CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성
     * - 반복 rule을 수정한 경우:
     *      - "관련 일정 모두/이 일정 이후" 2개만 보여줌
     *          - 관련 일정 모두 수정인 경우: 관련 일정 모두 삭제 후, 업데이트 DTO -> CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성
     *          - 이 일정 이후 수정인 경우: 이 일정 이후 삭제 후, CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성
     * - 반복 rule은 수정하지 않았지만, endDate를 수정한 경우:
     *      - "관련 일정 모두/이 일정 이후" 2개만 보여줌
     *          - 관련 일정 모두 수정인 경우: 관련 일정 모두 삭제 후, 업데이트 DTO -> CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성
     *          - 이 일정 이후 수정인 경우: 이 일정 이후 삭제 후, CreateEventDto 타입으로 변환 후 새로운 반복 일정 생성 + 이 이전의 일정의 recurringEventId => null로 변경
     */

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
                            <div className="location-display" onClick={() => setShowLocationModal(true)}>
                                <div className="location-info">
                                    <span className="location-name">{location.nameKo || location.nameEn}</span>
                                    <span className="location-address">{location.address}</span>
                                </div>
                                <button
                                    type="button"
                                    className="location-remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLocationRemove();
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
                onUpdateSingle={handleUpdateSingle}
                onUpdateRecurring={handleUpdateRecurring}
                onUpdateFromThis={handleUpdateFromThis}
                isRecurring={!!event?.recurringEventId}
                eventTitle={event?.title || ""}
                showSingleOption={getShowSingleOption()}
            />
        </div>
    );
}
