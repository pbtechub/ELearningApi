import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const dbUrl = process.env.DB_URL || '';

const connectDb = async () => {
    try {
        await mongoose.connect(dbUrl).then((data) => {
            console.log(`Db is connected with ${data.connection.host}`);
        })
    } catch (error) {
        console.log(error.message);
        setTimeout(connectDb, 5000)
    }
}

export default connectDb