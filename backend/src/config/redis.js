const redis=require('redis');
require('dotenv').config();

const redisClient=redis.createClient({
    username: 'default',
    password: process.env.REDDIS_PASS,
    socket: {
        host: process.env.REDDIS_HOST,
        port: 11506
    }
})

//how to coonect to DB

module.exports=redisClient;