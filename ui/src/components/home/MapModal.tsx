"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { ResponseEvent } from "@/lib/types/event.interface";

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: ResponseEvent[];
    selectedDate: Date;
}

export default function MapModal({ isOpen, onClose, events, selectedDate }: MapModalProps) {
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const polylineRef = useRef<google.maps.Polyline | null>(null);

    // 선택된 날짜의 이벤트 가져기기
    const getSelectedDateEvents = () => {
        const selectedDateStr = selectedDate.toISOString().split("T")[0];

        const filteredEvents = events.filter((event) => {
            const eventDateStr = event.startTime.split(" ")[0];
            return eventDateStr === selectedDateStr;
        });

        return filteredEvents.sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            return a.startTime.localeCompare(b.startTime);
        });
    };

    // 구글맵 초기화
    const initializeMap = () => {
        if (!mapRef.current || !window.google || !isGoogleMapsLoaded) {
            console.log("Map initialization failed:", {
                mapRef: !!mapRef.current,
                windowGoogle: !!window.google,
                isGoogleMapsLoaded,
            });
            return;
        }

        console.log("Initializing Google Maps...");

        const selectedDateEvents = getSelectedDateEvents();
        const eventsWithLocation = selectedDateEvents.filter((event) => event.location);

        if (eventsWithLocation.length === 0) {
            const defaultLocation = { lat: 37.5666805, lng: 126.9784147 };
            const map = new google.maps.Map(mapRef.current, {
                center: defaultLocation,
                zoom: 13,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                mapId: "DEMO_MAP_ID",
            });
            mapInstanceRef.current = map;
            console.log("Map initialized with default location");
            return;
        }

        const firstLocation = eventsWithLocation[0].location!;
        const center = { lat: firstLocation.latitude, lng: firstLocation.longitude };

        const map = new google.maps.Map(mapRef.current, {
            center: center,
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            mapId: "DEMO_MAP_ID",
        });

        mapInstanceRef.current = map;
        console.log("Map initialized with event locations");
        addMarkersAndRoute(eventsWithLocation);
    };

    // 마커 추가 및 경로 표시
    const addMarkersAndRoute = (eventsWithLocation: ResponseEvent[]) => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach((marker) => marker.map = null);
        markersRef.current = [];

        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        const path: google.maps.LatLng[] = [];

        eventsWithLocation.forEach((event, index) => {
            const location = event.location!;
            const position = { lat: location.latitude, lng: location.longitude };

            path.push(new google.maps.LatLng(location.latitude, location.longitude));

            const markerElement = document.createElement('div');
            markerElement.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: ${event.colorCode};
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            `;
            markerElement.textContent = (index + 1).toString();

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: position,
                map: mapInstanceRef.current,
                title: event.title,
                content: markerElement,
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 8px;">
                        <strong>${event.title}</strong><br/>
                        <div style="color: #666; font-size: 12px;">
                            ${
                                event.isAllDay
                                    ? "하루종일"
                                    : `${event.startTime.split(" ")[1]} - ${event.endTime.split(" ")[1]}`
                            }
                        </div>
                        <div style="color: #888; font-size: 11px; margin-top: 4px;">
                            📍 ${location.nameKo || location.nameEn}
                        </div>
                    </div>
                `,
            });

            marker.addListener("click", () => {
                infoWindow.open({
                    anchor: marker,
                    map: mapInstanceRef.current,
                });
            });

            markersRef.current.push(marker);
        });

        if (path.length > 1) {
            const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: "#4F46E5",
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });

            polyline.setMap(mapInstanceRef.current);
            polylineRef.current = polyline;

            const bounds = new google.maps.LatLngBounds();
            path.forEach((point) => bounds.extend(point));
            mapInstanceRef.current.fitBounds(bounds);
        }
    };

    // 위치 검색
    const searchLocation = () => {
        if (!searchValue.trim() || !mapInstanceRef.current || !window.google) return;

        const service = new google.maps.places.PlacesService(mapInstanceRef.current);
        const request = {
            query: searchValue,
            fields: ["name", "geometry"],
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                const place = results[0];
                if (place.geometry && place.geometry.location) {
                    mapInstanceRef.current?.setCenter(place.geometry.location);
                    mapInstanceRef.current?.setZoom(15);

                    const searchMarkerElement = document.createElement('div');
                    searchMarkerElement.style.cssText = `
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: #EF4444;
                        border: 3px solid white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    `;
                    searchMarkerElement.textContent = '🔍';

                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: place.geometry.location,
                        map: mapInstanceRef.current,
                        title: place.name,
                        content: searchMarkerElement,
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div><strong>${place.name}</strong></div>`,
                    });

                    marker.addListener("click", () => {
                        infoWindow.open({
                            anchor: marker,
                            map: mapInstanceRef.current,
                        });
                    });

                    markersRef.current.push(marker);
                }
            }
        });

        setSearchValue("");
    };

    // 구글맵 로드 시 지도 초기화
    useEffect(() => {
        if (isGoogleMapsLoaded && isOpen && mapRef.current) {
            // DOM이 완전히 렌더링된 후 맵을 초기화하기 위해 setTimeout 사용
            const timer = setTimeout(() => {
                initializeMap();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isGoogleMapsLoaded, isOpen, selectedDate]);

    // 모달이 열릴 때 지도 리사이즈
    useEffect(() => {
        if (isOpen && mapInstanceRef.current && isGoogleMapsLoaded) {
            // 모달 애니메이션이 완료된 후 리사이즈
            const timer = setTimeout(() => {
                const mapInstance = mapInstanceRef.current;
                if (mapInstance) {
                    window.google?.maps?.event?.trigger(mapInstance, "resize");
                    const selectedDateEvents = getSelectedDateEvents();
                    const eventsWithLocation = selectedDateEvents.filter((event) => event.location);

                    if (eventsWithLocation.length > 0) {
                        const firstLocation = eventsWithLocation[0].location!;
                        mapInstance.setCenter({
                            lat: firstLocation.latitude,
                            lng: firstLocation.longitude,
                        });
                    } else {
                        mapInstance.setCenter({ lat: 37.5666805, lng: 126.9784147 });
                    }
                    console.log("Map resized and centered");
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`}
                onLoad={() => {
                    console.log("Google Maps API loaded successfully");
                    setIsGoogleMapsLoaded(true);
                }}
                onError={(e) => {
                    console.error("Google Maps API failed to load", e);
                    console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
                }}
                strategy="afterInteractive"
            />
            <div className="map-modal-overlay" onClick={onClose}>
                <div className="map-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button - Top Left */}
                    <button className="map-modal-close" onClick={onClose} aria-label="모달 닫기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Search Box - Top Right */}
                    <div className="map-search-container">
                        <input
                            type="text"
                            className="map-search-input"
                            placeholder="위치 검색..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                        />
                        <button className="map-search-btn" onClick={searchLocation}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Map Content */}
                    <div className="map-modal-content">
                        {!isGoogleMapsLoaded ? (
                            <div className="map-placeholder">
                                <div className="coming-soon-icon">🗺️</div>
                                <p>Google Maps 로딩 중...</p>
                            </div>
                        ) : (
                            <div ref={mapRef} className="modal-google-map" style={{ width: "100%", height: "100%" }} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
