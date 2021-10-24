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
    
    if(returnResult.coinbase.btcBuy<returnResult.gemini.btcBuy){
        returnResult.btcBuyCoinBase = true;
    }
        
    else{
        returnResult.btcBuyGemini = true;
    }

    if(returnResult.btcBuyCoinBase && returnResult.coinbase.btcBuy < returnResult.gemini.btcSell)
    {
        returnResult.btcSellGemini=true;
        returnResult.btcProfit = returnResult.gemini.btcSell - returnResult.coinbase.btcBuy;

    }

    if(returnResult.btcBuyGemini && returnResult.gemini.btcBuy < returnResult.coinbase.btcSell)
    {
        returnResult.btcSellCoinbase=true;
        returnResult.btcProfit = returnResult.coinbase.btcSell - returnResult.gemini.btcBuy;

    }

    if(returnResult.coinbase.ethBuy<returnResult.gemini.ethBuy){
        returnResult.ethBuyCoinBase = true;
       
    }
        
    else{
        returnResult.ethBuyGemini = true;
    }

    if(returnResult.ethBuyCoinBase && returnResult.coinbase.ethBuy < returnResult.gemini.ethSell)
    {
        returnResult.ethSellGemini=true;
        returnResult.ethProfit = returnResult.gemini.ethSell - returnResult.coinbase.ethBuy;

    }

    if(returnResult.ethBuyGemini && returnResult.gemini.ethBuy < returnResult.coinbase.ethSell)
    {
        returnResult.ethSellCoinbase=true;
        returnResult.ethProfit = returnResult.coinbase.ethSell - returnResult.gemini.ethBuy;

    }
        
    res.json(returnResult);

});

module.exports = router;