import { useState } from "react";
import { createSearchMarker } from "@/lib/utils/mapUtils";

interface MapSearchProps {
    map: google.maps.Map | null;
    onMarkerCreated: (marker: google.maps.Marker) => void;
}

export default function MapSearch({ map, onMarkerCreated }: MapSearchProps) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        if (!searchValue.trim() || !map || !window.google) return;

        const service = new google.maps.places.PlacesService(map);
        const request = {
            query: searchValue,
            fields: ["name", "geometry"],
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
                const place = results[0];
                if (place.geometry?.location) {
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);

                    const marker = createSearchMarker(place, map);
                    onMarkerCreated(marker);
                }
            }
        });

        setSearchValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="map-search-container">
            <input
                type="text"
                className="map-search-input"
                placeholder="위치 검색..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button className="map-search-btn" onClick={handleSearch}>
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
    );
}