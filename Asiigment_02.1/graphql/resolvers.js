import searchPlace from "../api/foursquare.js";
//import  PlaceModel  from "../mongoose/mongooseSchema.js";
const resolvers = {
    Query: {
        searchPizzas: async (_, { lat, lng, radius }) => {
            const result = await searchPlace(lat, lng, "pizza", radius);
            return result.map((place) => ({
                ...place,
                rating: isNaN(place.rating) ? null : Number(place.rating), // ✅ Ensure valid number
            }));
        },
        searchJuices: async (_, { lat, lng, radius }) => {
            const result = await searchPlace(lat, lng, "juice", radius);
            return result.map((place) => ({
                ...place,
                rating: isNaN(place.rating) ? null : Number(place.rating),
            }));
        },
        searchCombos: async (_, { lat, lng, radius }) => {
            const [pizzaPlaces, juicePlaces] = await Promise.all([
                searchPlace(lat, lng, "pizza", radius),
                searchPlace(lat, lng, "juice", radius),
            ]);

            const comboPlaces = pizzaPlaces.filter((pizza) =>
                juicePlaces.some(
                    (juice) =>
                        pizza.name === juice.name || pizza.address === juice.address
                )
            );

            return comboPlaces.map((place) => ({
                ...place,
                rating: isNaN(place.rating) ? null : Number(place.rating),
            }));
        },
    },
};

export default resolvers;

//await PlaceModel.insertMany(result,{order:false}).catch(()=>{});
