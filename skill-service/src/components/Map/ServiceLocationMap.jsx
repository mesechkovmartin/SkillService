import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function ServiceLocationMap({ location }) {
    const cityCoordinates = {
        Sofia: [42.6977, 23.3219],
        Plovdiv: [42.1354, 24.7453],
        Varna: [43.2141, 27.9147],
        Burgas: [42.5048, 27.4626],
        Pleven: [43.4170, 24.6067]
    };

    const hasCoordinates =
        location?.latitude !== null &&
        location?.longitude !== null &&
        location?.latitude !== undefined &&
        location?.longitude !== undefined;

    const position = hasCoordinates
        ? [location.latitude, location.longitude]
        : cityCoordinates[location?.city] || cityCoordinates.Sofia;

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location?.city || "Sofia")}`;

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-3xl font-bold">Service Location</h2>

                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                    Open in Google Maps
                    <HiOutlineExternalLink size={16} />
                </a>
            </div>

            <MapContainer
                center={position}
                zoom={hasCoordinates ? 15 : 12}
                scrollWheelZoom={false}
                className="h-80 w-full"
            >
                <TileLayer
                    attribution="© Stadia Maps © OpenMapTiles © OpenStreetMap contributors"
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
                />

                <Marker position={position}>
                    <Popup>
                        {location?.address || location?.area || location?.city}
                    </Popup>
                </Marker>
            </MapContainer>

            <div className="p-4 text-gray-500 text-sm">
                {location?.locationType === "precise" && location?.address
                    ? location.address
                    : location?.locationType === "approximate" && location?.area
                        ? `Around ${location.area}, ${location.city}`
                        : `Operates across ${location?.city} and surrounding areas`}
            </div>
        </div>
    );
}

/*  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />*/