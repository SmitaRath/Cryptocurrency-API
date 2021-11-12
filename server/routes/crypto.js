const express = require("express");
const axios = require("axios");
const router=express.Router();
const redis = require('redis');
const redisCache = redis.createClient();

router.get("/cryptocurrency",async(req,res)=>{
    //declaring json object to return
    let returnResult={
        gemini:{},
        coinbase:{},
        profitEth:{ buyList:[], profitList:[]},
        profitBtc:{ buyList:[], profitList:[]}
    };
    //fetching data from gemini exchange for bitcoin
    try{
        const { data } = await axios.get("https://api.gemini.com/v1/pubticker/btcusd");
        returnResult.gemini.btcBuy=data.ask;
        returnResult.gemini.btcSell=data.bid;
    }
    catch(e){
        console.log(e);
    }
    //fetching data from gemini exchange for ethereum
    try{
        const { data } = await axios.get("https://api.gemini.com/v1/pubticker/ethusd");
        returnResult.gemini.ethBuy=data.ask;
        returnResult.gemini.ethSell=data.bid;
    }
    catch(e){
        console.log(e);
    }
    //fetching data from coinbase for buying price of bitcoin
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy");
        returnResult.coinbase.btcBuy=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
     //fetching data from coinbase for selling price of bitcoin
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/sell");
        returnResult.coinbase.btcSell=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
     //fetching data from coinbase for buying price of ethereun
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/buy");
        returnResult.coinbase.ethBuy=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
     //fetching data from coinbase for selling price of bitcoin
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/sell");
        returnResult.coinbase.ethSell=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
    
    //checking for lower buying price of bitcoin

    if(returnResult.coinbase.btcBuy<returnResult.gemini.btcBuy){
        returnResult.btcBuyCoinBase = true;
    }
        
    else{
        returnResult.btcBuyGemini = true;
    }

    //checking for profit for selling bitcoin
    if(returnResult.btcBuyCoinBase)
    {
        returnResult.btcProfit = (returnResult.gemini.btcSell - returnResult.coinbase.btcBuy).toFixed(3);
        if(returnResult.coinbase.btcBuy < returnResult.gemini.btcSell)
            returnResult.btcSellGemini=true;
    }
    

    if(returnResult.btcBuyGemini)
    {
        returnResult.btcProfit = (returnResult.coinbase.btcSell - returnResult.gemini.btcBuy).toFixed(3);
        if(returnResult.gemini.btcBuy < returnResult.coinbase.btcSell)
            returnResult.btcSellCoinbase=true;

    }
    
    //checking for lower buying price of ethereum
    if(returnResult.coinbase.ethBuy<returnResult.gemini.ethBuy){
        returnResult.ethBuyCoinBase = true;
       
    }
        
    else{
        returnResult.ethBuyGemini = true;
    }

    //checking for ethereum profit
    if(returnResult.ethBuyCoinBase)
    {
        returnResult.ethProfit = (returnResult.gemini.ethSell - returnResult.coinbase.ethBuy).toFixed(3);
        if(returnResult.coinbase.ethBuy < returnResult.gemini.ethSell)
            returnResult.ethSellGemini=true;
        
    }
    

    if(returnResult.ethBuyGemini)
    {
        returnResult.ethProfit = (returnResult.coinbase.ethSell - returnResult.gemini.ethBuy).toFixed(3);
        if(returnResult.gemini.ethBuy < returnResult.coinbase.ethSell)
            returnResult.ethSellCoinbase=true;
        

    }

    redisCache.lrange("profitListBtc",0,-1, function(err,result){
        if(result.length!=0){
            for(let arr of result){
                let obj=JSON.parse(arr);
                returnResult.profitBtc.profitList.push(obj);
            }
        }
    })

    redisCache.lrange("buyListBtc",0,-1, function(err,result){
        if(result.length!=0){
            for(let arr of result){
                let obj=JSON.parse(arr);
                returnResult.profitBtc.buyList.push(obj);
            }
        }
    })


    let profitBtc;
    let maxBTCSellPrice;

    redisCache.get("minimumBuyBtc", function(err,result){
        if(result!=null){
            let minBuyData = JSON.parse(result);
            if(returnResult.coinbase.btcSell > returnResult.gemini.btcSell){
                maxBTCSellPrice = returnResult.coinbase.btcSell;
                returnResult.profitBtc.coinbase=true;
            }
            else{
                maxBTCSellPrice = returnResult.gemini.btcSell;
                returnResult.profitBtc.coinbase=false;
            }

            profitBtc = maxBTCSellPrice - minBuyData.minBuyPrice;
            if(profitBtc > 0){
                returnResult.profitBtc.value = profitBtc.toFixed(3);
                returnResult.profitBtc.flag=true;
                returnResult.profitBtc.minBuyPrice = minBuyData.minBuyPrice;
                returnResult.profitBtc.minBuyTime = minBuyData.minBuyTime;
            }
        }
    })

   
    
    let profit;
    let maxSellPriceEth;

    redisCache.lrange("buyPriceListEth", 0, -1, function(err,result){
        if(result.length!=0){
            if(returnResult.profitEth.buyList.length < result.length){
                let diff =  result.length - returnResult.profitEth.buyList.length;
                for(let i =0; i < diff; i++){
                    returnResult.profitEth.buyList.push(JSON.parse(result[i]));
                }
            }
        }
    })

    redisCache.lrange("profitEth", 0, -1, function(err,result){
        if(result.length!=0){
            if(returnResult.profitEth.profitList.length < result.length){
                let diff =  result.length - returnResult.profitEth.profitList.length;
                for(let i =0; i < diff; i++){
                    returnResult.profitEth.profitList.push(JSON.parse(result[i]));
                }
            }
        }
    })

    redisCache.get("MinimumBuyEth", function(err,result){
        if(result!=null)
        {
            if(returnResult.coinbase.ethSell > returnResult.gemini.ethSell)
            {
                maxSellPriceEth = returnResult.coinbase.ethSell;
                returnResult.profitEth.coinbase=true;
            }   
            else{
                maxSellPriceEth = returnResult.gemini.ethSell;
                returnResult.profitEth.gemini=false;
            } 

            let minBuyPriceObj = JSON.parse(result);
            profit=maxSellPriceEth-(minBuyPriceObj.minBuyPrice);
            if(profit>0){      
                returnResult.profitEth.value=profit.toFixed(3);
                returnResult.profitEth.flag = true;
                returnResult.profitEth.timestamp = minBuyPriceObj.minBuyTime;
                returnResult.profitEth.minBuyPrice= minBuyPriceObj.minBuyPrice;
            }
        }
        res.json(returnResult);
    })
    
    
       
    //return object to the client side
    
});




router.post("/buyEth", async(req,res)=>{

    let buyPrice = req.body.buyPrice;
    let buyPriceTime = req.body.timestamp;
    let minBuyPriceObj = {
        minBuyPrice:parseFloat(buyPrice),
        minBuyTime:buyPriceTime
    }

    redisCache.get("MinimumBuyEth", function(err,result){
        if(result!=null)
        {
            const buyingPriceData = JSON.parse(result);
             if(parseFloat(buyPrice) < buyingPriceData.minBuyPrice)
                {
                    redisCache.del("MinimumBuyEth");
                    redisCache.set("MinimumBuyEth",JSON.stringify(minBuyPriceObj))
                }
        }
        else{
            redisCache.set("MinimumBuyEth",JSON.stringify(minBuyPriceObj))
        }

        

    })

    redisCache.lpush('buyPriceListEth',JSON.stringify(minBuyPriceObj));
    res.redirect("/cryptocurrency");
    

})



router.post("/sellEth", async(req,res)=>{

    redisCache.lpush("profitEth", JSON.stringify(req.body));

    let minBuyPriceValue=Number.POSITIVE_INFINITY;
    let minBuyTimeValue;


    redisCache.get("MinimumBuyEth", function(err,result){
    
           
            redisCache.lrem("buyPriceListEth",1,result);
            redisCache.del("MinimumBuyEth");
            redisCache.lrange("buyPriceListEth",0,-1, function(err,res){
                if(res.length!=0){
                    for(let str of res){
                        let obj = JSON.parse(str);
                        {
                            if(minBuyPriceValue>obj.minBuyPrice){
                                minBuyPriceValue=obj.minBuyPrice;

                                minBuyTimeValue=obj.minBuyTime;
                                
                            }
                        }
                    }
                    
                    redisCache.set("MinimumBuyEth",JSON.stringify({minBuyPrice:minBuyPriceValue,
                    minBuyTime:minBuyTimeValue
                    }));
                }

                

            })
    })

    res.redirect("/cryptocurrency");
  //  redisCache.lrem("MinimumBuy",)
    

})

router.post("/btcBuy", async(req,res)=>{
    let minBuyPriceValue = parseFloat(req.body.minBuyPrice);
    let minBuyTimeValue = req.body.minBuyTime;

    redisCache.get("minimumBuyBtc", function(err,res){
        if(res!=null){
            let resObj = JSON.parse(res);
            if(resObj.minBuyPrice > minBuyPriceValue){
                redisCache.del("minimumBuyBtc");
                redisCache.set("minimumBuyBtc", JSON.stringify({
                    minBuyPrice:minBuyPriceValue,
                    minBuyTime:minBuyTimeValue
                }))
            }
        }
        else{
            redisCache.set("minimumBuyBtc", JSON.stringify({
                minBuyPrice:minBuyPriceValue,
                minBuyTime:minBuyTimeValue
            }))
        }
    })

    redisCache.lpush("buyListBtc",JSON.stringify({
        minBuyPrice:minBuyPriceValue,
        minBuyTime:minBuyTimeValue
    }));
    res.redirect("/cryptocurrency");
})

router.post("/btcSell", async(req,res)=>{

    redisCache.lpush("profitListBtc", JSON.stringify(req.body));
    
    let minBuyPriceValue = Number.POSITIVE_INFINITY;
    let minBuyTimeValue;

    redisCache.get("minimumBuyBtc", function(err,result){


        redisCache.lrem("buyListBtc",1,result);
        redisCache.del("minimumBuyBtc");
        redisCache.lrange("buyListBtc", 0 ,-1 , function(err,result){
            if(result.length!=0){
                for(let arr of result){
                    obj = JSON.parse(arr);
                    if(minBuyPriceValue > obj.minBuyPrice){
                        minBuyPriceValue=obj.minBuyPrice;
                        minBuyTimeValue = obj.minBuyTime;

                    }
                    redisCache.set("minimumBuyBtc", JSON.stringify({
                        minBuyPrice:minBuyPriceValue,
                        minBuyTime:minBuyTimeValue
                    }))

                }
            }
        })
    })

    res.redirect("crytocurrency");

})

module.exports = router;