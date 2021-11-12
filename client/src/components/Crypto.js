import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React from "react";
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CardGroup from 'react-bootstrap/CardGroup';
import moment from 'moment';
import gemini from '../img/gemini.png';
import coinbase from '../img/coinbase.jpeg';
import crypto from '../img/Cryptocurrency.jpeg';
import '../App.css';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'



function Crypto(props) {

    const [result,setResult] = useState({});
    const [loading,setLoading] = useState(true);
    const [date,setDate] = useState(moment()
    .utcOffset('-04')
    .format('MMM DD,YYYY hh:mm:ss a'));


    function changeDate(){
      var date = moment()
      .utcOffset('-04')
      .format('MMM DD,YYYY hh:mm:ss a');
      setDate(date);
    }

    function buyEthereum(buyPriceArg){
      
      async function getData(){
        let requestObj = {
          buyPrice:buyPriceArg,
          timestamp:date
        }
        try{
          const data = await axios.post("http://localhost:4000/buyEth",requestObj);
          if(data.data)
          {
            setResult(data);
            setLoading(false);
          }
        }
        catch(e){
          console.log(e);
        }
      }

      getData();

    }


    function sellEthereum(profitVal, ethBuyPriceValue, timestampValue){
      let reqObj = {
        profit:profitVal,
        ethBuyPrice:ethBuyPriceValue,
        timestamp : timestampValue
      }


      
      async function sellData(){
        try{
          const data = await axios.post("http://localhost:4000/sellEth", reqObj);
          if(data.data)
          {
            setResult(data);
            setLoading(false);
          }
        }
        catch(e){
          console.log(e);
        }
      } 

      sellData();

    } 

    function buyBitcoin(buyprice,buytime){
      let reqObj ={
        minBuyPrice : buyprice,
        minBuyTime : buytime
      }
      async function setData(){
        try{
          const data = await axios.post("http://localhost:4000/btcBuy",reqObj);
          setResult(data);
          setLoading(false);
        }
        catch(e){
          console.log(e);
        }
      }
      setData();
    }


    function sellBitcoin(profitValue,minBuyPriceValue,timestampValue){
      let reqObj ={
        profit:profitValue,
        minBuyPrice : minBuyPriceValue,
        timestamp : timestampValue
      }
      console.log(reqObj);
      async function setData(){
        try{
          const data = await axios.post("http://localhost:4000/btcSell",reqObj);
          setResult(data);
          setLoading(false);
        }
        catch(e){
          console.log(e);
        }
      }
      setData();
    }
  

    useEffect(
		() => {
      async function getNewPrices()
      {
            try{
                const data = await axios.get("http://localhost:4000/cryptocurrency");
                if(data.data)
               // console.log(data);
                  {setResult(data);
                  setLoading(false);
                }
            }
            catch(e){
                console.log(e);
                //setLoading(true);
            }	
      }
      getNewPrices();	
		},[date])

    setInterval(changeDate, 1000);
    

    if(loading){
        
    return (
        <div>
        Loading.......
        </div>
    )
    }
    else
    {
        return(
        <div>
            <img className="img" src={crypto}/>

<Tabs defaultActiveKey="Bitcoin" id="uncontrolled-tab-example" className="mb-3">
  <Tab eventKey="Bitcoin" title="Bitcoin">
  <CardGroup>
  <Card>
    <Card.Img variant="top" src={coinbase} />
    <Card.Body>
      <Card.Text>
        <p>Buy : ${result.data.coinbase.btcBuy}</p>
        <p>Sell : ${result.data.coinbase.btcSell}</p>
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Last updated at {date}</small>
    </Card.Footer>
  </Card>
  <Card>
    <Card.Img variant="top" src={gemini} />
    <Card.Body>
      <Card.Text>
        <p>Buy : ${result.data.gemini.btcBuy}</p>
        <p>Sell : ${result.data.gemini.btcSell}</p>
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Last updated at {date}</small>
    </Card.Footer>
  </Card>
</CardGroup>

<Accordion>
{result.data.profitBtc.buyList.length>0 ?

  <Accordion.Item eventKey="0">
    <Accordion.Header>Buying History</Accordion.Header>
    <Accordion.Body>
    {result.data.profitBtc.buyList.map((buy) => {
											return <p key={buy.minBuyTime}> bought ${buy.minBuyPrice}, on {buy.minBuyTime}</p>;
										})}
    </Accordion.Body>
  </Accordion.Item>
  : <p></p>
  }
</Accordion>

          {result.data.btcBuyCoinBase ?
          <Alert variant="info">
            <p>You should buy from Coinbase</p>
            <Button variant ="primary" onClick={function(e){
              buyBitcoin(result.data.coinbase.btcBuy,date)
            }}> Buy </Button>
            {result.data.btcSellGemini ?
           <p>And you can sell to Gemini - Profit: ${result.data.btcProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.btcProfit}/unit </p>}
            </Alert>
          : <p></p>} 

        {result.data.btcBuyGemini ?
           <Alert variant="info">
           <p>You should buy from Gemini</p>
           <Button variant ="primary" onClick={function(e){
              buyBitcoin(result.data.gemini.btcBuy,date)
            }}> Buy </Button>
           {result.data.btcSellCoinbase ?
           <p>And you can sell to Coinbase - Profit: ${result.data.btcProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.btcProfit}/unit </p>}
           </Alert>
          : <p></p>} 

<Accordion>
{result.data.profitBtc.profitList.length>0 ?

  <Accordion.Item eventKey="0">
    <Accordion.Header>Profit Earned</Accordion.Header>
    <Accordion.Body>
    {result.data.profitBtc.profitList.map((sell) => {
											return <p key={sell.timestamp}> earned ${sell.profit}/unit, on {sell.timestamp} after selling {sell.minBuyPrice}</p>;
										})}
    </Accordion.Body>
  </Accordion.Item>
  : <p></p>
  }
</Accordion>

          {result.data.profitBtc.flag ?
          <Alert variant = "success">
          <Button variant ="primary" onClick={function(e){
              sellBitcoin(result.data.profitBtc.value, result.data.profitBtc.minBuyPrice ,date)
            }}> Sell </Button>
          <p>You bought bitcoin at ${result.data.profitBtc.minBuyPrice}/unit on {result.data.profitBtc.minBuyTime},
          you get profit of {result.data.profitBtc.value}, if you sell it to {result.data.profitBtc.coinbase ? "Coinbase" : "Gemini"}</p>
          </Alert>
           :
           <p></p> }


  </Tab>
  <Tab eventKey="Ethereum" title="Ethereum">
  <CardGroup>
  <Card>
    <Card.Img variant="top" src={coinbase} />
    <Card.Body>
      <Card.Text>
      <p>Buy : ${result.data.coinbase.ethBuy}</p>
        <p>Sell : ${result.data.coinbase.ethSell}</p>
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Last updated at {date}</small>
    </Card.Footer>
  </Card>
  <Card>
    <Card.Img variant="top" src={gemini} />
    <Card.Body>
      <Card.Text>
      <p>Buy : ${result.data.gemini.ethBuy}</p>
        <p>Sell : ${result.data.gemini.ethSell}</p>
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Last updated at {date}</small>
    </Card.Footer>
  </Card>
</CardGroup>

        {result.data.ethBuyCoinBase ?
          <Alert variant="info">
            <p>You should buy from Coinbase</p>
            <Button variant="primary" onClick={function(e) {
            buyEthereum(result.data.gemini.ethBuy); }}>Buy</Button>
            {result.data.ethSellGemini ?
           <p>And you can sell to Gemini - Profit: ${result.data.ethProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.ethProfit}/unit</p>}
            </Alert>
          : <p></p>} 

<Accordion>
{result.data.profitEth.buyList.length>0 ?

  <Accordion.Item eventKey="0">
    <Accordion.Header>Buying History</Accordion.Header>
    <Accordion.Body>
    {result.data.profitEth.buyList.map((buy) => {
											return <p key={buy.minBuyTime}> bought ${buy.minBuyPrice}, on {buy.minBuyTime}</p>;
										})}
    </Accordion.Body>
  </Accordion.Item>
  : <p></p>
  }
</Accordion>

        {result.data.ethBuyGemini ?
           <Alert variant="info">
           <p>You should buy from Gemini</p>
           <Button variant="primary" onClick={function(e) {
    buyEthereum(result.data.gemini.ethBuy); }}>Buy</Button>
           {result.data.ethSellCoinbase ?
           <p>And you can sell to Coinbase - Profit: ${result.data.ethProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.ethProfit}/unit</p>}
           </Alert>
          : <p></p>} 

<Accordion>

{result.data.profitEth.profitList.length>0 ?
  <Accordion.Item eventKey="1">
    <Accordion.Header>Profit Earned till now</Accordion.Header>
    <Accordion.Body>
    {result.data.profitEth.profitList.map((sell) => {
											return <p key={sell.timestamp}> Earned ${sell.profit}/unit, sold ${sell.ethBuyPrice} on {sell.timestamp}</p>;
										})}
    </Accordion.Body>
  </Accordion.Item>
  :<p></p>
}
</Accordion>

          {result.data.profitEth.flag ?
          <Alert variant="success">
          <Button variant="primary" onClick={function(e) {
           sellEthereum(result.data.profitEth.value, result.data.profitEth.minBuyPrice, date)}}>Sell</Button>
          <p>You bought ethereum at {result.data.profitEth.minBuyPrice} on {result.data.profitEth.timestamp}  and you are getting profit ${result.data.profitEth.value}/unit, 
          if you sell it to {result.data.profitEth.coinbase ? "Coinbase" : "Gemini"}</p> 
          </Alert>
          : <p></p>}

  </Tab>

</Tabs>
        

    </div>
    );
}
  }
  
  export default Crypto;