import { cities } from "../../constants/cities";

export default function HeroSearch({searchInput, setSearchInput, cityInput, setCityInput, onSearch}) {

    const handlePopularSearch = (item) => {
        setSearchInput(item);
        onSearch(item);
    }

    return (
        <div className="max-w-5xl mx-auto mt-8 mb-12">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="What service do you need?"
                    className="input input-bordered flex-1 bg-base-200"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <select
                    className="select select-bordered flex-1 bg-base-200"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}>

                    <option value="">Select city</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                <button 
                type="button"
                className="btn btn-primary px-10"
                onClick={() => onSearch(searchInput)}
                >
                    Search
                </button>

            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
                <span className="text-gray-500">Popular:</span>

                {["Cleaning", "Repair", "Education", "Fitness", "Photography"].map((item) => (
                    <button 
                    key={item} 
                    type="button"
                    className="btn btn-sm btn-outline rounded-full"
                    onClick={() => handlePopularSearch(item)}
                    >
                        {item}
                    </button>
                ))}

            </div>
        </div>
    )
}