import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATA_BASE_URI)
    } catch (error) {
        console.log(error)
    }
}