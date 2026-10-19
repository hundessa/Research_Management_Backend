import { PORT } from "./config/config.js";
import server from "./server/server.js";
import { connectDB } from "./db/db.js";

try {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
