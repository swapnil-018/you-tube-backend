import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const DatabaseConnection = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MongoDB connected successfully  DB HOST :- ${connectionInstance.connection.host}` )
        
    } catch (error) {
        console.log(error,'error in DataBase Connection')
        process.exit(1)
    }
} 

export default DatabaseConnection   