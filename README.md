# Cryptocurrency-API
This is a web page for recommending users to buy/sell cryptocurreny.

### Instructions for running the application
Kindly download the node.js if it is not installed in the system from the below link:
https://nodejs.org/en/download/

#### If redis is not installed in the system, please install it using the below link
https://phoenixnap.com/kb/install-redis-on-mac

### These are the steps which needs to be followed to run the application.

Once redis and Node.js are installed successfully<br/><br/>
### Start redis by performing below steps:<br/>
In a terminal window type in the follwing to get the Redis server running on the default port: brew services start redis <br/>
Test whether the redis server is running by typing in: redis-cli ping and it should return "PONG" </br>
To clear the old redis cache enter redis-cli FLUSHALL (it will clear all the old data from the cache)

Open 2 terminals in the project folder
### Terminal 1-
• cd server<br/>
• npm install<br/>
• node app.js <br/>
### Terminal 2-
• cd client<br/>
• npm install<br/>
• npm start<br/>

Backend<br/>
The server will start running at localhost:4000</br>
Frontend</br>
The React client will start running at localhost:3000 automatically.


### 1.	Are there any sub-optimal choices( or short cuts taken due to limited time ) in your implementation?
Ans) No
### 2.	Is any part of it over-designed? ( It is fine to over-design to showcase your skills as long as you are clear about it)
Ans) No
### 3.	If you have to scale your solution to 100 users/second traffic what changes would you make, if any?
Ans) 
1.	For this application I am using free API, if my users are more then I will go for premium API where I will have unlimited requests.
2.	I will deploy a proxy cache server to which my users will request and get data directly. The proxy cache server will fetch data from the API and make it available in the cache persistently. In that case for every user request, my application will not hit the exchange server, but it can get the data from the proxy cache server.
### 4.	What are some other enhancements you would have made, if you had more time to do this implementation?
Ans)
Three enhancements I could have done.
### Implemented
1.	First, I would have also used Redis to store the data on temporary cache, so if the application has recommended to buy from some exchange, then that price can be saved in the temporary cache, for the selling recommendation
3.	Second, the historical prices can also be shown to the user for the better recommendation of buying and selling.
5.	For the previous week I can store the exchange prices, profit and timestamp, whenever there is a profit and can be shown to the user for last week which will give a better picture to user about the market trend.



### Once application is done, please stop the redis server using command: brew services stop redis


![image](https://user-images.githubusercontent.com/72769273/141520596-1223120e-5ee0-42ad-80d7-9454324fdeee.png)

## User bought bitcoin, so buying price saved in the cache
![image](https://user-images.githubusercontent.com/72769273/141520747-ee7da8ef-bca6-41c0-ba04-b4ae59537d6f.png)

## User bought again, so prices are saved in the cache and it is displaying to user
![image](https://user-images.githubusercontent.com/72769273/141520871-eda0534e-1c92-497e-930e-a6929e9b2137.png)

## Application recommends user to sell, from the minimum buying price( stored in the cache)
![image](https://user-images.githubusercontent.com/72769273/141524350-534187b0-dc07-4233-a06c-b70846c46ce8.png)

## User sells it, so application is showing how much profit user has made
![image](https://user-images.githubusercontent.com/72769273/141524415-a8c932e9-7aad-498a-9d2c-5e26c4ee9981.png)

## Application is recommending again user to sell, from the minimum buying price(stored in the cache)
![image](https://user-images.githubusercontent.com/72769273/141524616-21a79101-379b-483f-a114-4e2eb84dc8c6.png)

## User sells it, so application shows how much profit user has made till now and application is recommending to sell if user has still bitcoins and can make more profit
![image](https://user-images.githubusercontent.com/72769273/141524671-609cdeb3-4be8-4148-bb23-6af12b75043f.png)




