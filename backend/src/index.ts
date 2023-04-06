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





let joinedClients = new Map<string, { gameId: string, isGameStarted: boolean, players: { username: string, clientId: string }[] }>()

io.on("connection", (socket) => {
    console.log("connection made");

    socket.on("get_games",
        (msg, callback) => {

            let rooms = io.sockets.adapter.rooms;
            let message: string;
            let gameData = joinedClients.get(msg.gameId);

            if (rooms.has(msg.gameId) && !gameData?.isGameStarted) {
                //check if the client id isalready in the room
                message = "200";
                callback(message);

            } else if (rooms.has(msg.gameId) && gameData?.isGameStarted) {

                message = "403";
                callback(message)
            } else {

                message = "404";
                callback(message);
            }

        })

    socket.on("get_players", (msg) => {
        if (msg.gameId) {
            io.emit("set_players", (joinedClients.get(msg.gameId)))
        }

    })


    socket.on("create_game", async (msg, callback) => {
        let clientId = msg.clientId;
        let gameId = msg.gameId;
        let username = msg.username;

        socket.join(gameId);
        joinedClients.set(gameId, { gameId: gameId, isGameStarted: false, players: [{ username, clientId }] });

        let arrClients = Array.from(joinedClients.values());

        let gameData = joinedClients.get(msg.gameId);
        io.to(gameId).emit("game_highlights", {
            gameId,
            gameData,
            message: `${username} created the game`
        })
        callback(arrClients);



    });

    socket.on("start_game", (msg) => {
        let counter = 10;
        let isGameStarted = false;
        let gameId = msg.gameId;


        let gameStartedBy = msg.gameStartedBy;

        if (joinedClients.has(gameId)) {
            let game: any = joinedClients.get(gameId);
            game.isGameStarted = true;
            joinedClients.set(gameId, game);
        }

        let countdown = setInterval(() => {
            io.to(msg.gameId).emit("countdown", counter)
            counter--;
            if (counter === -1) {
                // io.emit("countdown",);
                isGameStarted = true
                clearInterval(countdown)
            }
        }, 1000);
        io.to(msg.gameId).emit("game_highlights", {
            gameId,
            message: `${gameStartedBy} started the game`
        });
        io.to(msg.gameId).emit("start_game", {
            gameId: msg.gameId,
            gameStartedBy: msg.gameStartedBy,
            isGameStarted: isGameStarted
        })
    })



    socket.on("selected_phrase", (msg) => {

        let { gameId, selectedBy, selectedPhrase } = msg;
        //gameid,playerid,answer
        io.to(msg.gameId).emit("selected_phrase", {
            gameId, selectedBy, selectedPhrase
        })


    })

    socket.on("win_game", (msg) => {
        let { gameId, wonBy } = msg;
        io.to(msg.gameId).emit("get_winner", {
            gameId,
            wonBy
        })

        io.to(msg.gameId).emit("game_highlights", {
            gameId,
            message: `${wonBy} scored Bingo`
        });
        // socket.disconnect();
        let rooms = io.sockets.adapter.rooms;

        if (rooms.has(gameId)) {
            io.socketsLeave(msg.gameId);

        }
    })

    socket.on("end_game", (msg) => {

    })

    socket.on("exit_game", (msg) => {
        socket.leave(msg.gameId);
        let { gameId, username } = msg;
        io.to(msg.gameId).emit("game_highlights", {
            gameId,
            message: `${username} left the game`
        })
    })

    socket.on("join_game", async (msg) => {
        let clientId = msg.clientId;
        let gameId = msg.gameId;
        let username = msg.username;

        socket.join(gameId);
        joinedClients.get(gameId)?.players.push({ username, clientId });


        let gameData = joinedClients.get(msg.gameId);

        io.to(gameId).emit("game_highlights", {
            gameId,
            gameData,
            message: `${username} joined the game`
        })
    })


})



app.use(express.json());
