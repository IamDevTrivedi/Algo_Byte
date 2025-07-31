import axios from "axios"
//http://localhost:3000
//https://algo-byte-my.onrender.com/
const axiosClient =  axios.create({
     baseURL: 'https://algo-byte-my.onrender.com/',
    // baseURL : "http://localhost:3000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;