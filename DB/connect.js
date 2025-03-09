
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect("mongodb+srv://adeolu_admin:4akudQBdfrjCtkAc@atlascluster.d5eauqw.mongodb.net/AuthTestDB")
        console.log(`conncted to mogoDB: ${conn.connection.host}`)
    }catch(error){
        console.log("Error Connection to MongoDB: ", error.message)
        process.exit(1)//failure, 0 status code is succces
    }
}