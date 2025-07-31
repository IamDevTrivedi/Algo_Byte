import { io } from "socket.io-client";
//https://algo-byte-i7uc.onrender.com
//http://localhost:3000
const socket = io(
  // "http://localhost:3000",

  "https://algo-byte-i7uc.onrender.com",

  {
    withCredentials: true,
  }
);

export default socket;
