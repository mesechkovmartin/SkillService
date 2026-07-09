// Get the current location data (latitude, longitude, address, city) using the browser's geolocation API and OpenStreetMap's Nominatim service.
export async function getCurrentLocationData() {
    if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser.");
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await res.json();

                    resolve({
                        latitude,
                        longitude,
                        address: data.display_name || "",
                        city:
                            data.address?.city ||
                            data.address?.town ||
                            data.address?.village ||
                            ""
                    });
                } catch (error) {
                    resolve({
                        latitude,
                        longitude,
                        address: "",
                        city: ""
                    });
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
}

// Get the coordinates (latitude, longitude) from an address using OpenStreetMap's Nominatim service.
export async function getCoordinatesFromAddress(addressText) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressText)}&limit=1`
    );

    const data = await res.json();

    if (data.length === 0) {
        return null;
    }

    return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon)
    };
}

// Complete a location by adding coordinates when needed.
export async function completeLocation(location) {
    let completedLocation = { ...location };

    if (
        completedLocation.locationType === "precise" &&
        completedLocation.address &&
        (!completedLocation.latitude || !completedLocation.longitude)
    ) {
        const coordinates = await getCoordinatesFromAddress(
            `${completedLocation.address}, ${completedLocation.city}, Bulgaria`
        );

        if (coordinates) {
            completedLocation = {
                ...completedLocation,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            };
        }
    }

    if (
        completedLocation.locationType === "approximate" &&
        completedLocation.area &&
        (!completedLocation.latitude || !completedLocation.longitude)
    ) {
        const coordinates = await getCoordinatesFromAddress(
            `${completedLocation.area}, ${completedLocation.city}, Bulgaria`
        );

        if (coordinates) {
            completedLocation = {
                ...completedLocation,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            };
        }
    }

    return completedLocation;
}

// Update a specific field in the location object, resetting dependent fields if the location type changes.
export function updateLocationField(oldLocation, name, value) {
    if (name === "locationType") {
        return {
            ...oldLocation,
            locationType: value,
            area: "",
            address: "",
            latitude: null,
            longitude: null
        };
    }

    if (name === "city" || name === "area" || name === "address") {
        return {
            ...oldLocation,
            [name]: value,
            latitude: null,
            longitude: null
        };
    }

    return {
        ...oldLocation,
        [name]: value
    };
}