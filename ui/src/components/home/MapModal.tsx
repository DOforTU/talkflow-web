"use client";

import { useEffect, useRef } from "react";
import "./MapModal.css";
import { ResponseEventDto } from "@/lib/types/event.interface";
import { getEventsForDateIncludingMultiDay, sortEventsByTime } from "@/lib/utils/eventUtils";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_OPTIONS, createEventMarker, createRoutePolyline, clearMapOverlays } from "@/lib/utils/mapUtils";
import MapSearch from "./MapSearch";

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: ResponseEventDto[];
    selectedDate: Date;
}

export default function MapModal({ isOpen, onClose, events, selectedDate }: MapModalProps) {
    const { isLoaded: isGoogleMapsLoaded } = useGoogleMaps();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const polylineRef = useRef<google.maps.Polyline | null>(null);


    // 선택된 날짜의 이벤트 가져기기
    const getSelectedDateEvents = () => {
        const filteredEvents = getEventsForDateIncludingMultiDay(events, selectedDate);
        return sortEventsByTime(filteredEvents);
    };

    const initializeMap = () => {
        if (!mapRef.current || !window.google || !isGoogleMapsLoaded) {
            return;
        }

        const selectedDateEvents = getSelectedDateEvents();
        const eventsWithLocation = selectedDateEvents.filter((event) => event.location);

        const center = eventsWithLocation.length > 0
            ? { lat: eventsWithLocation[0].location!.latitude, lng: eventsWithLocation[0].location!.longitude }
            : DEFAULT_MAP_CENTER;

        const map = new google.maps.Map(mapRef.current, {
            ...DEFAULT_MAP_OPTIONS,
            center,
        });

        mapInstanceRef.current = map;
        addMarkersAndRoute(eventsWithLocation);
    };

    const addMarkersAndRoute = (eventsWithLocation: ResponseEventDto[]) => {
        if (!mapInstanceRef.current) return;

        clearMapOverlays(markersRef.current, polylineRef.current);
        markersRef.current = [];
        polylineRef.current = null;

        eventsWithLocation.forEach((event, index) => {
            const marker = createEventMarker(event, index, mapInstanceRef.current!);
            markersRef.current.push(marker);
        });

        if (eventsWithLocation.length > 1) {
            polylineRef.current = createRoutePolyline(eventsWithLocation, mapInstanceRef.current!);
        }
    };

    const handleMarkerCreated = (marker: google.maps.Marker) => {
        markersRef.current.push(marker);
    };

    useEffect(() => {
        if (isGoogleMapsLoaded && isOpen && mapRef.current) {
            const timer = setTimeout(() => {
                initializeMap();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isGoogleMapsLoaded, isOpen, selectedDate]);

    useEffect(() => {
        if (isOpen && mapInstanceRef.current && isGoogleMapsLoaded) {
            const timer = setTimeout(() => {
                const mapInstance = mapInstanceRef.current;
                if (mapInstance) {
                    window.google?.maps?.event?.trigger(mapInstance, "resize");
                    const selectedDateEvents = getSelectedDateEvents();
                    const eventsWithLocation = selectedDateEvents.filter((event) => event.location);

                    const center = eventsWithLocation.length > 0
                        ? { lat: eventsWithLocation[0].location!.latitude, lng: eventsWithLocation[0].location!.longitude }
                        : DEFAULT_MAP_CENTER;
                    
                    mapInstance.setCenter(center);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="map-modal-container">
            <div className="map-modal-overlay" onClick={onClose}>
                <div className="map-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button - Top Left */}
                    <button className="map-modal-close" onClick={onClose} aria-label="모달 닫기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <MapSearch
                        map={mapInstanceRef.current}
                        onMarkerCreated={handleMarkerCreated}
                    />

                    {/* Map Content */}
                    <div className="map-modal-content">
                        {!isGoogleMapsLoaded ? (
                            <div className="map-placeholder">
                                <div className="coming-soon-icon">🗺️</div>
                                <p>Google Maps 로딩 중...</p>
                            </div>
                        ) : (
                            <div ref={mapRef} className="modal-google-map" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
