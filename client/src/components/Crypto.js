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



function Crypto(props) {

    const [result,setResult] = useState({});
    const [loading,setLoading] = useState(true);
    const [date,setDate] = useState(moment()
    .utcOffset('-04')
    .format(' hh:mm:ss a'));


    function changeDate(){
      var date = moment()
      .utcOffset('-04')
      .format(' hh:mm:ss a');
      setDate(date);
    }

    useEffect(
		() => {
      async function getNewPrices()
      {
            try{
                const data = await axios.get("http://localhost:4000/cryptocurrency");
                if(data.data)
                  {setResult(data);
                  setLoading(false);
                }
            }
            catch(e){
                console.log(e);
                setResult(null);
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

          {result.data.btcBuyCoinBase ?
          <Alert variant="info">
            <p>You should buy from Coinbase</p>
            {result.data.btcSellGemini ?
           <p>And you can sell to Gemini - Profit: ${result.data.btcProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.btcProfit}/unit </p>}
            </Alert>
          : <p></p>} 

        {result.data.btcBuyGemini ?
           <Alert variant="info">
           <p>You should buy from Gemini</p>
           {result.data.btcSellCoinbase ?
           <p>And you can sell to Coinbase - Profit: ${result.data.btcProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.btcProfit}/unit </p>}
           </Alert>
          : <p></p>} 


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
            {result.data.ethSellGemini ?
           <p>And you can sell to Gemini - Profit: ${result.data.ethProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.ethProfit}/unit</p>}
            </Alert>
          : <p></p>} 

        {result.data.ethBuyGemini ?
           <Alert variant="info">
           <p>You should buy from Gemini</p>
           {result.data.ethSellCoinbase ?
           <p>And you can sell to Coinbase - Profit: ${result.data.ethProfit}/unit </p> :
           <p>But do not sell now, you can sell in future when prices are good - Profit: ${result.data.ethProfit}/unit</p>}
           </Alert>
          : <p></p>} 
  </Tab>

</Tabs>
        

    </div>
    );
}
  }
  
  export default Crypto;