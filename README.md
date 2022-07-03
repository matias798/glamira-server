

# Glamira Node.js Server


## **`Demo`**:  [Glamira server](https://glamira-server.herokuapp.com/first-9-products)
  
 
 
## Installation

  

Use the package manager (npm) or (yarn) to install.

```npm install``` or  ```yarn install```
  

**Install Ngrok [Ngrok docs](https://ngrok.com/docs)**

   To start the ngrok server you can use the following command:
  
 

    ngrok http -host-header="localhost:3001" 3001


    
Change `SERVER_URL` environment variable on the .env file to the ngrok https urls.


## Usage

Run  ``` npm start``` or ``` yarn start``` to start the glamira server on port 3001.



Search ``` https:localhost:3001/```  on the browser or postman and add the specific route to get data or dispatch actions.


## APi Endpoints

**``` GET ```**

  
  
 -  Return all products ```/products/all```
 -  Return list of 9 products ```/first-9-products```
 -  Create a purchase collection in the mongo database```/purchase```  
 -  Return array with the specified category in :category ``` /products/:category```
  - Route registers users `/user/register`
 
  



**``` POST ```**


 -  Creates a new purchase  ```/payment```
 -  Change data from purchase with mobbex webhook `/purchase`
-   Route used to login user `/user/login`
 -  Get array data with the orders from the user `/user/orders`



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License

[MIT](https://choosealicense.com/licenses/mit/)
