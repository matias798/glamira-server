
# Glamira Node.js Server

## Installation

  

Use the package manager (npm) or (yarn) to install.

```npm install``` or  ```yarn install```

## Usage

Run  ``` npm start``` or ``` yarn start``` to start the glamira server on port 3001.
Search 'https:localhost:3001/' on the browser or postman and add the specific route to get data or dispatch actions.


## APi Endpoints

**``` GET ```**

  

 - Return list of 9 products ```/first-9-products```
 - Return all products ```/all-products```
 - create a purchase collection in the mongo database```/purchase```

**``` POST ```**



Makes api call to mobbex api ```/payment```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  ## Ngrok
  To start the ngrok server you can use the following command:
  
 

    ngrok http -host-header="localhost:3001" 3001

  [https://ngrok.com/docs]

## License

[MIT](https://choosealicense.com/licenses/mit/)
