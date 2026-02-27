import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4001;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_URL = process.env.CLIENT_URL;
export const MONGO_URI = process.env.MONGO_URI;