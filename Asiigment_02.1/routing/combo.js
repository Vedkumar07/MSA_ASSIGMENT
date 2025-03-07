import Router from "express";
import searchPlace from "../api/foursquare.js";
import PlaceModel from "../mongoose/mongooseSchema.js";

const comboRouter = Router();

comboRouter.post("/combo", async (req, res) => {
    const { lat, lng, radius } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        const [pizzaPlaces, juicePlaces] = await Promise.all([
            searchPlace(lat, lng, "pizza", radius),
            searchPlace(lat, lng, "juice", radius),
        ]);
        const combo = pizzaPlaces.filter((pizzaPlace) =>
            juicePlaces.some(
                (juicePlace) =>
                    pizzaPlace.name === juicePlace.name ||
                    pizzaPlace.address === juicePlace.address
            )
        );
        const savedShops = await Promise.all(
            combo.map(async (shop) => {
                const existingShop = await PlaceModel.findOne({ name: shop.name });
                if (!existingShop) {
                    return await PlaceModel.create({
                        name: shop.name,
                        address: shop.address,
                        rating: isNaN(shop.rating) ? null : Number(shop.rating),
                        phone: shop.phone || "Not available",
                    });
                }
                return existingShop;
            })
        );

        if (combo.length > 0) {
            res.json(savedShops);
        } else {
            res.status(404).json({ error: "No restaurant offers both pizza and juice" });
        }
    } catch (error) {
        console.error("Error fetching combo:", error);
        res.status(500).json({ error: "Error fetching combo" });
    }
});

export default comboRouter;
