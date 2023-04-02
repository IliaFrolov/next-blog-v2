import mongoose from "mongoose";

const url = process.env.MONGODB_URL as string;

const dbConnect = async () => {
    try {
        return await mongoose.connect(url);
    } catch (error) {
        console.error('db connection fail', error)
    }
}
export default dbConnect;