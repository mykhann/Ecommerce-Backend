import mongoose from "mongoose";
const dbConnect=async()=>{
    try {
        const db= await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`connected to MONGODB !! ${process.env.DB_NAME} `);
        
    } catch (error) {
        console.log("unable to connect to Mongo");
        
    }
}

export {dbConnect}