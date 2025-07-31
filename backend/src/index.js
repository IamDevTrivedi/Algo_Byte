const express = require("express");
const http = require("http"); // Required for socket.io
require("dotenv").config();

const main = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const authRouter = require("./routes/userAuth");
const reddisClient = require("./config/redis");
const problemRouter = require("../src/routes/problemCreator");
const submissionRouter = require("./routes/submit");
const aiRouter = require("../src/routes/aiChatting");
const videoRouter = require("../src/routes/videoCreator");
const imageRouter = require("./routes/imageCreator");
const activityRouter = require("./routes/activity");
const bookmarkRouter = require("./routes/bookmarkList");
const discussionRouter = require("./routes/discussion");
const roomUsers = {}; // roomId -> [ { socketId, name, userId } ]
const axios = require("axios");

const { Server } = require("socket.io");
const contestRouter = require("./routes/contest");
const POTDrouter = require("./routes/POTDroute");
const battleRoomRouter = require("./routes/battleRoom");

const app = express();
const server = http.createServer(app); //  correct usage
const io = new Server(server, {
  cors: {
    // origin: "https://algo-byte-seven.vercel.app", // frontend origin
    origin: "https://algo-byte-eight.vercel.app/",
    credentials: true,
  },
});

//  Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

//https://algo-byte-seven.vercel.app

//http://localhost:5174
//  Middlewares
app.use(
  cors({
    // origin: 'https://algo-byte-seven.vercel.app',
    origin: "https://algo-byte-eight.vercel.app/",
    credentials: true,
  })
);

const rooms = {};
const roomPlayersMap = new Map();

app.use(express.json());
app.use(cookieParser());

//  Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submissionRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/image", imageRouter);
app.use("/activity", activityRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/discussion", discussionRouter);
app.use("/contest", contestRouter);
app.use("/potd", POTDrouter);
app.use("/battle", battleRoomRouter);

app.post("/create-room", (req, res) => {
  const roomId = uuidv4();

  const { code } = req.body;
  rooms[roomId] = code;

  res.json({ roomId });
});

let onlineUsers = 0;

const connectionInitialization = async () => {
  try {
    await reddisClient.connect();
    console.log("Redis connected");

    await main();
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      setInterval(() => {
        axios
          .get("https://algo-byte-my.onrender.com/health")
          .then((res) => {
            console.log(`Health check successful`);
          })
          .catch((err) => {
            console.error(`Health check failed`);
          });
      }, 8 * 60 * 1000);
    });

    const removeUserFromRoom = (socketId) => {
      for (const roomId in roomUsers) {
        const prevLength = roomUsers[roomId].length;
        roomUsers[roomId] = roomUsers[roomId].filter(
          (u) => u.socketId !== socketId
        );
        if (roomUsers[roomId].length !== prevLength) {
          io.to(roomId).emit("roomUsersUpdate", roomUsers[roomId]);
        }
      }
    };

    // Optional: handle socket connection
    io.on("connection", (socket) => {
      onlineUsers++;

      socket.on("join-battle-room", ({ roomId, user }) => {
        socket.join(roomId);

        const currentPlayers = roomPlayersMap.get(roomId) || [];

        const alreadyExists = currentPlayers.some(
          (u) => String(u._id) === String(user._id)
        );

        if (!alreadyExists) {
          if (currentPlayers.length == 0) {
            let newuser = {};
            newuser = { ...user, isHost: true };
            currentPlayers.push(newuser);
            roomPlayersMap.set(roomId, currentPlayers);
          } else {
            currentPlayers.push(user);
            roomPlayersMap.set(roomId, currentPlayers);
          }
        }

        io.to(roomId).emit("update-players", currentPlayers);
      });
      socket.on("update-user-status", ({ roomId, userId, status, name }) => {
        const players = roomPlayersMap.get(roomId) || [];
        const updatedPlayers = players.map((p) =>
          p._id === userId ? { ...p, status } : p
        );
        roomPlayersMap.set(roomId, updatedPlayers);

        // Broadcast to everyone in the room
        io.to(roomId).emit("status-update", {
          userId,
          status,
          name,
          players: updatedPlayers,
        });
      });
      socket.on("start-battle", ({ roomId }) => {
        io.to(roomId).emit("navigating-battle", roomId);
      });

      socket.on("joinRoom", ({ roomId, user }, callback) => {
        socket.join(roomId);
        if (!roomUsers[roomId]) roomUsers[roomId] = [];

        roomUsers[roomId] = roomUsers[roomId].filter(
          (u) => u.socketId !== socket.id
        );

        roomUsers[roomId].push({
          socketId: socket.id,
          firstName: user.firstName,
          userId: user._id,
        });

        io.to(roomId).emit("roomUsersUpdate", roomUsers[roomId]);

        if (!rooms[roomId]) {
          rooms[roomId] = "";
        }

        io.to(socket.id).emit("loadCode", rooms[roomId]);

        if (callback) callback();
      });
      socket.on("codeChange", ({ roomId, code }) => {
        rooms[roomId] = code;
        socket.to(roomId).emit("remoteCodeChange", code);
      });

      socket.on("leaveRoom", ({ roomId }) => {
        socket.leave(roomId);
        removeUserFromRoom(socket.id);
      });

      io.emit("onlineUsers", onlineUsers);

      socket.on("disconnect", () => {
        onlineUsers--;
        io.emit("onlineUsers", onlineUsers);
        for (const roomId in roomUsers) {
          const before = roomUsers[roomId].length;
          roomUsers[roomId] = roomUsers[roomId].filter(
            (user) => user.socketId !== socket.id
          );
          const after = roomUsers[roomId].length;

          if (before !== after) {
            io.to(roomId).emit("roomUsersUpdate", roomUsers[roomId]);
          }

          // Optional: cleanup empty room
          if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
          }
        }
      });
    });
  } catch (err) {
    console.error("Startup error:", err.message);
  }
};

connectionInitialization();
