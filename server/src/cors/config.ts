import { CorsOptions } from "cors";

export const config: CorsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://BakaList.onrender.com"
      : process.env.FRONTEND_URL,
  credentials: true,
};