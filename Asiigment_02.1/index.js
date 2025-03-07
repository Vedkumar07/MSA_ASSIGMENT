import dotenv from "dotenv";
dotenv.config();
import express from "express"; 
import mongoose from "mongoose";
import cors from "cors";
import juiceRouter from "./routing/juice.js";
import pizzaRouter from "./routing/pizza.js";
import comboRouter from "./routing/combo.js";
import { ApolloServer } from "@apollo/server"; 
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import rater from "./middleware.js/rateLimiting.js";

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOption));
app.use(express.json()); 


app.use("/shop", juiceRouter);
app.use("/shop", pizzaRouter);
app.use("/shop", comboRouter);


 const server = new ApolloServer({ typeDefs, resolvers });

 const { url } = await startStandaloneServer(server, {
     listen: { port },
     context: async ({ req }) => ({ req }),
     cors: {
         origin: "*",  // Allow all origins
         credentials: true,
         methods: ["GET", "POST", "OPTIONS"],
         allowedHeaders: ["Content-Type", "Authorization"],
     },
 });


 console.log(`GraphQL Server running at ${url}`);

async function main() {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection failed:", err));
    app.listen(process.env.EXPRESSPORT,()=>{
        console.log("express surver is running ");
    });
    console.log("apikey",process.env.FOURSQUARE_API_KEY);
    app.use(rater);
}
main();
