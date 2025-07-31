const redisClient = require('../config/redis');

// Total Time: 60 min
const windowSize = 3600;
const MaxRequest = 60;

const rateLimiter = async (req,res,next)=>{

    try{
        const key = `IP:${req.ip}`;
        const current_time = Date.now()/1000;
        const window_Time = current_time - windowSize;
        // 1.20 min -1hour = 12.20 = 3122312

        const lastRequest = await redisClient.zRange(key, -1, -1);
        if (lastRequest.length > 0) {
            const lastRequestTimestamp = parseFloat(lastRequest[0].split(":")[0]);
            
            if(current_time-lastRequestTimestamp<5){
                throw new Error("Wait to make new request")
            }
        }

        
        await redisClient.zRemRangeByScore(key, 0, window_Time);

        const numberOfRequest = await redisClient.zCard(key);
       

        if(numberOfRequest>=MaxRequest){
            throw new Error("Number of Request Exceeded");
        }

        await redisClient.zAdd(key,[{score:current_time, value:`${current_time}:${Math.random()}`}]);
        
        await redisClient.expire(key,windowSize);
        next();
    }
    catch(err){
        res.send("Error: "+err);
    }

}


module.exports = rateLimiter;


// ::1