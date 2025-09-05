import { ResponseEventDto } from "@/lib/types/event.interface";

export const DEFAULT_MAP_CENTER = { lat: 37.5666805, lng: 126.9784147 };
export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
};

export const createEventMarker = (
    event: ResponseEventDto,
    index: number,
    map: google.maps.Map
): google.maps.Marker => {
    const location = event.location!;
    const position = { lat: location.latitude, lng: location.longitude };

    const marker = new google.maps.Marker({
        position,
        map,
        title: event.title,
        label: {
            text: (index + 1).toString(),
            color: "white",
            fontWeight: "bold",
        },
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: event.colorCode || "#4F46E5",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 3,
            scale: 20,
        },
    });

    const infoWindow = new google.maps.InfoWindow({
        content: createEventInfoWindowContent(event),
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    return marker;
};

export const createSearchMarker = (
    place: google.maps.places.PlaceResult,
    map: google.maps.Map
): google.maps.Marker => {
    const marker = new google.maps.Marker({
        position: place.geometry!.location!,
        map,
        title: place.name,
        label: {
            text: "🔍",
            color: "white",
        },
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#EF4444",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 3,
            scale: 25,
        },
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${place.name}</strong></div>`,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    return marker;
};

export const createRoutePolyline = (
    events: ResponseEventDto[],
    map: google.maps.Map
): google.maps.Polyline | null => {
    if (events.length < 2) return null;

    const path = events.map(event => 
        new google.maps.LatLng(event.location!.latitude, event.location!.longitude)
    );

    const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#4F46E5",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });

    polyline.setMap(map);

    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    return polyline;
};

export const clearMapOverlays = (
    markers: google.maps.Marker[],
    polyline?: google.maps.Polyline | null
): void => {
    markers.forEach(marker => marker.setMap(null));
    if (polyline) {
        polyline.setMap(null);
    }
};

const createEventInfoWindowContent = (event: ResponseEventDto): string => {
    const timeDisplay = event.isAllDay
        ? "하루종일"
        : `${event.startTime.split(" ")[1]} - ${event.endTime.split(" ")[1]}`;

    return `
        <div style="padding: 8px;">
            <strong>${event.title}</strong><br/>
            <div style="color: #666; font-size: 12px;">
                ${timeDisplay}
            </div>
            <div style="color: #888; font-size: 11px; margin-top: 4px;">
                📍 ${event.location!.nameKo || event.location!.nameEn}
            </div>
        </div>
    `;
};