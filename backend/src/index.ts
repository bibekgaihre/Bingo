import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import cors from "cors";

config()
const app: Application = express();
app.use(cors());
declare var process: {
    env: {
        PORT: number
    }
}

let server = http.createServer(app);


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});

const io = new Server(server, {
    transports: ["websocket", "polling"], allowEIO3: true, cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    console.log("connection made");
    let joinedClients: any = [];
    socket.on("get_games", async (msg) => {

        let rooms = io.sockets.adapter.rooms;
        console.log(rooms, "-----");
        if (rooms.has(msg.gameId)) {
            console.log("room eixts");
            //check if the client id is already in the room

        } else {
            console.log("room doesnot exist")
        }
        console.log(msg);
    })
    socket.on("create_game", async (msg, callback) => {
        let clientId = msg.clientId;
        let gameId = msg.gameId;
        console.log(clientId, gameId);
        socket.join(gameId);

        const sockets = await io.in(gameId).fetchSockets();

        sockets.map(el => {
            console.log(el.id, "----");
            joinedClients.push(el.id);
        });
        callback(joinedClients);



    })



    socket.on("selected_word", (msg) => {

        //gameid,playerid,answer
        console.log(msg)
    })

    socket.on("join_game", async (msg) => {
        let clientId = msg.clientId;
        let gameId = msg.gameId;

        const sockets = await io.in(gameId).fetchSockets();

        sockets.map(el => {
            console.log(el.id, "----");
            joinedClients.push(el.id);
        });
        socket.to(gameId).emit("game_join_response", {
            gameId,
            clientId,
            joinedClients,
            message: `${clientId} joined the game`
        })
    })


})



app.use(express.json());
