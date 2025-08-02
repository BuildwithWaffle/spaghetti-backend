import mongoose, { connect, ConnectionStates } from "mongoose";
import { DB_NAME } from "../constants";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST ${connectionInstance.connection.host}`);
        console.log("MongoDB connected")
    } catch (error) {
        
    }
}

export default connectDB