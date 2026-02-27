import { PORT } from "./config/config.js";
import server from "./server/server.js";
import { connectDB } from "./db/db.js";

await connectDB();

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
