import http from "http";
import { Server } from "socket.io";
import app from "../app/app.js";
import { PORT, CLIENT_URL } from "../config/config.js";


const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export default server;