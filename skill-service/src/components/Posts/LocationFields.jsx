import { cities } from "../../constants/cities";
import { getCurrentLocationData } from "../../helpers/location.helper.js";

export default function LocationFields({ location, onLocationChange, setFormData }) {
    const handleUseCurrentLocation = async () => {
        try {
            const locationData = await getCurrentLocationData();

            setFormData((oldData) => ({
                ...oldData,
                location: {
                    ...oldData.location,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    address: locationData.address,
                    city: locationData.city || oldData.location.city
                }
            }));
        } catch (error) {
            console.error(error);
            alert("Unable to get your current location.");
        }
    };

    return (
        <div className="space-y-3">
            <p className="font-semibold">Service location</p>

            <div className="flex flex-wrap gap-4">
                {["city", "approximate", "precise"].map((type) => (
                    <label key={type} className="label cursor-pointer gap-2">
                        <input
                            type="radio"
                            name="locationType"
                            value={type}
                            checked={location.locationType === type}
                            onChange={onLocationChange}
                            className="radio radio-primary"
                        />
                        {type === "city" ? "City only" : type}
                    </label>
                ))}
            </div>

            <select
                name="city"
                className="select select-bordered w-full"
                value={location.city}
                onChange={onLocationChange}
                required
            >
                <option value="">Select City</option>
                {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>

            {location.locationType === "approximate" && (
                <input
                    name="area"
                    type="text"
                    placeholder="Area / neighborhood"
                    className="input input-bordered w-full"
                    value={location.area}
                    onChange={onLocationChange}
                    required
                />
            )}

            {location.locationType === "precise" && (
                <div className="space-y-3">
                    <button
                        type="button"
                        className="btn btn-outline w-full"
                        onClick={handleUseCurrentLocation}
                    >
                        📍 Use my current location
                    </button>

                    <input
                        name="address"
                        type="text"
                        placeholder="Exact address"
                        className="input input-bordered w-full"
                        value={location.address}
                        onChange={onLocationChange}
                    />
                </div>
            )}
        </div>
    );
}