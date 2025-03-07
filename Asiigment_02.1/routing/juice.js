import Router from "express";
const juiceRouter=Router();
import PlaceModel from "../mongoose/mongooseSchema.js";
import  searchPlace  from "../api/foursquare.js";
juiceRouter.post("/juice", async (req, res) => {
    const { lat, lng, radius } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        const data = await searchPlace(lat, lng, "juice", radius);

        const savedShops = await Promise.all(
            data.map(async (shop) => {
                 const existingShop = await PlaceModel.findOne({ name: shop.name });
                 if (!existingShop) {
                    return await PlaceModel.create({
                        name: shop.name,
                        address: shop.address,
                        rating: isNaN(shop.rating) ? null : Number(shop.rating), // ✅ Ensure valid number
                        phone: shop.phone || "Not available",
                    });
                 }
                return existingShop;
            })
        );

        res.json({ message: "Data stored successfully", savedShops });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error fetching juice places" });
    }
});
export default juiceRouter;