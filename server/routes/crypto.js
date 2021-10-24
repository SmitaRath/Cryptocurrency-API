const express = require("express");
const axios = require("axios");
const router=express.Router();

router.get("/cryptocurrency",async(req,res)=>{
    //declaring json object to return
    let returnResult={
        gemini:{},
        coinbase:{}
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
       
    //return object to the client side
    res.json(returnResult);

});

module.exports = router;