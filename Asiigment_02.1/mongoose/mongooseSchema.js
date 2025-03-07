import mongoose from "mongoose";
const Schema=mongoose.Schema;
const PlaceSchema=new Schema({
    name:{type:String},
    address:{type:String},
    rating: { type: Number, min: 0, max: 5, default: null },
    phone:{type:String}
});
const PlaceModel=mongoose.model("place",PlaceSchema);
export default PlaceModel;