const express = require("express");
const axios = require("axios");
const router=express.Router();

router.get("/cryptocurrency",async(req,res)=>{
    let returnResult={
        gemini:{},
        coinbase:{}
    };
    try{
        const { data } = await axios.get("https://api.gemini.com/v1/pubticker/btcusd");
        returnResult.gemini.btcBuy=data.ask;
        returnResult.gemini.btcSell=data.bid;
    }
    catch(e){
        console.log(e);
    }
    try{
        const { data } = await axios.get("https://api.gemini.com/v1/pubticker/ethusd");
        returnResult.gemini.ethBuy=data.ask;
        returnResult.gemini.ethSell=data.bid;
    }
    catch(e){
        console.log(e);
    }
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy");
        returnResult.coinbase.btcBuy=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/sell");
        returnResult.coinbase.btcSell=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/buy");
        returnResult.coinbase.ethBuy=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
    try{
        const { data } = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/sell");
        returnResult.coinbase.ethSell=data.data.amount;
    }
    catch(e){
        console.log(e);
    }
    res.json(returnResult);
});

module.exports = router;