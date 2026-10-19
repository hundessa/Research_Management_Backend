import dotenv from "dotenv";
dotenv.config();

const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "MONGO_URI",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const PORT = process.env.PORT || 4001;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
export const MONGO_URI = process.env.MONGO_URI;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
