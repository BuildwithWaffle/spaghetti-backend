import dotenv from "dotenv"

import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})




console.log("Environment variables loaded:");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

connectDB()
.then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`⚡️ Server is running at port : ${PORT}`);
    })
})
.catch( (err) => {
    console.log("MongoDB connection Failed !!! ", err)
})

