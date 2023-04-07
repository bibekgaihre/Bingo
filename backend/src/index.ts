import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import cors from "cors";

import { events } from "./events";


config()
const app: Application = express();
app.use(cors());
declare var process: {
    env: {
        PORT: number
    }
}
app.use(express.json());

let server = http.createServer(app);
const io = new Server(server, {
    transports: ["websocket", "polling"],
    allowEIO3: true,
    cors: {
        origin: "*",
    },
});


events(io);


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});



