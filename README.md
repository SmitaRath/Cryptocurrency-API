# Cryptocurrency-API
This is a web page for recommending users to buy/sell cryptocurreny.

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
1.	First, I would have also used Redis to store the data on temporary cache, so if the application has recommended to buy from some exchange, then that price can be saved in the temporary cache, for the selling recommendation.
2.	Second, the historical prices can also be shown to the user for the better recommendation of buying and selling.
3.	For the previous week I can store the exchange prices, profit and timestamp, whenever there is a profit and can be shown to the user for last week which will give a better picture to user about the market trend.
![image](https://user-images.githubusercontent.com/72769273/138611735-d43f5117-840c-4215-ab12-d989203b0f14.png)



![Screen Shot 2021-10-24 at 4 17 56 PM](https://user-images.githubusercontent.com/72769273/138611353-f15e2a3e-3be4-4f7d-a46b-38ab3b1a4099.png)

![Screen Shot 2021-10-24 at 4 18 23 PM](https://user-images.githubusercontent.com/72769273/138611374-eb0a4f93-f69c-4014-953b-b4d5a0a548bc.png)
