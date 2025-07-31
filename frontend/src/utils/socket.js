import { io } from "socket.io-client";
//https://algo-byte-my.onrender.com/
//http://localhost:3000
const socket = io(
  // "http://localhost:3000",

  "https://algo-byte-my.onrender.com/",

  {
    withCredentials: true,
  }
);

export default socket;
