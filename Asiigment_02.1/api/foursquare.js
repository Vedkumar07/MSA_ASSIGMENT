import axios from "axios";
const FOURSQUARE_API_KEY = 'fsq3kV7ny8u6zbLzM5wo7mZLF0JVuYrByJDsH0qxvBImOko=';
const BASE_URL = "https://api.foursquare.com/v3/places/search";

const searchPlace = async (lat, lng, dish, radius) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                "Authorization": FOURSQUARE_API_KEY,
                "Accept": "application/json",
            },
            params: {
                ll: `${lat},${lng}`, // Latitude, Longitude format
                query: dish, // Search term (e.g., "pizza")
                radius: radius, // Search radius in meters
                categories: "13065", // Category ID for restaurants (optional)
                limit: 10, // Limit number of results
            },
        });

        return response.data.results.map((place) => ({
            name: place.name,
            address: place.location.formatted_address || "Address not available",
            rating: place.rating || "No rating available",
            phone: place.tel || "Phone number not available",
        }));

    } catch (error) {
        console.error("Error fetching from Foursquare API:", error);
        return [];
    }
};

export default searchPlace;
