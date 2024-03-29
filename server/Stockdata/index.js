//load database with meta data and initial random stock prices
const setup = require('../Setup');
setup.loadDatabase().then(()=>{
    console.log("database loaded");
}).catch((e)=>{
    console.log(e);
});
const data = require("../data");
const Promise = require('bluebird');
const redisConnection = Promise.promisifyAll(require('../redis-connection'));




//get next stock price
redisConnection.on('StockData:request:*',async(message,_)=>{
    let requestId = message.requestId;
    let eventName = message.eventName;
    let successEvent = `${eventName}:success:${requestId}`;
    let failEvent = `${eventName}:failed:${requestId}`;
    
    try{
        let obj = await data.getByID(parseInt(message.data.id));
        let new_price = Math.random();
        if(new_price<0.4){
            new_price = obj.price-new_price;
        }else{
            new_price = obj.price+new_price;
        }
        await data.update(obj._id,new_price);
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: {
                _id: obj._id,
                price: new_price
            },
            eventName: eventName
          });
         
        //   console.log(list);
    }catch(e){
        console.log(e);
        console.log(e);
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {status: 404, message: e},
            eventName: eventName
          });
    }
});


//get stock metadata
redisConnection.on('meta:request:*',async(message,_)=>{
    let requestId = message.requestId;
    let eventName = message.eventName;
    let successEvent = `${eventName}:success:${requestId}`;
    let failEvent = `${eventName}:failed:${requestId}`;

    try{
        let obj = await data.getByID(parseInt(message.data.id));
        delete obj.price;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: obj,
            eventName: eventName
          });
         
        //   console.log(list);
    }catch(e){
        // console.log(e);
        console.log(e);
        redisConnection.emit(failEvent, {
            requestId: requestId,
            data: {status: 404, message: e},
            eventName: eventName
          });
    }
});






