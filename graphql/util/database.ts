import mongoose from "mongoose";
const MONGODB:any = process.env.MONGO_URL
const mongodb_connect = ()=>{
    mongoose.connect(MONGODB)
    .then(() =>console.log('MongoDB Connected Successfully'))
    .catch((err)=>console.log('MongoDB Connection Failed'))
}

export default mongodb_connect;

