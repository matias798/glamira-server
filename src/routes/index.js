// import packages
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

// import Models
const Products = require("./../Models/Products");
const Purchases = require("./../Models/Purchases");
const User = require("./../Models/Users");

/* GET All Products */
router.get("/products/all", function (req, res, next) {
  Products.find({}, function (err, products) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.status(200).json(products);
  });
});

// route to get only first 10 products
router.get("/first-9-products", function (req, res, next) {
  // Find first 10 products limited moongoose method
  Products.find({})
    .limit(9)
    .exec(function (err, products) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.status(200).json(products);
    });
});

router.get("/products/:category", function (req, res, next) {
  // filter %20 to spaces
  var params = req.params.category.replace(/%20/g, " ");

  Products.find({ category: params }, function (err, products) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.status(200).json(products);
  });
});
/* payment method with mobbex */
router.post("/payment", async (req, res) => {
  try {
    const user = jwt.decode(req.body.UserToken); // Decode JWT
    let items = req.body.items; // items array that user wants to buy
    var today = new Date(); //get current date

    // items id
    let itemsID = await items.map((item) => {
      return item.id;
    });

    // create a new Purchase
    var purchase = new Purchases({
      items: itemsID,
      user: user.id,
    });

    // save the purchase in the db
    purchase.save(function (err, purchase) {
      if (err) {
        console.log(err);
        res.status(200).json(err);
      }
      console.log("Purchase saved successfully");
    });

    // update user purchases by id in the db
    User.findByIdAndUpdate(
      user.id,
      { $push: { purchases: purchase._id } },
      { new: true },
      function (err, user) {
        if (err) {
          console.log(err);
          res.status(200).json(err);
        }
        console.log("User purchases updated successfully");
      }
    );

    // data to send to mobbex api
    var data = JSON.stringify({
      total: req.body.total,
      test: true,
      description: "Thank you for supporting us",
      due: {
        day: today.getDate(),
        month: today.getMonth() + 1, //January is 0!,
        year: today.getFullYear(),
      },
      currency: "ARS",
      secondDue: {
        days: 10,
        surcharge: 30,
      },
      items: items,
      customer: {
        name: `${user.name}`,
        identification: `${user.identification}`,
        email: `${user.email}`,
      },
      return_url: `${process.env.CLIENT_URL}/user/profile/orders/`,
      webhook: `${process.env.SERVER_URL}/purchase/`,
      reference: `${purchase._id}`,
      options: {
        smsMessage: "We sent you the generated order for your purchase",
      },
    });

    axios
      .post("https://api.mobbex.com/p/checkout", data, {
        headers: {
          "x-api-key": `${process.env.MOBBEX_API_KEY}`,
          "x-access-token": `${process.env.MOBBEX_ACCES_TOKEN}`,
          "x-lang": "es",
          "Content-Type": "application/json",
          "cache-control": "no-cache",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
      })

      .then(function (response) {
        console.log(response.data.data.url);
        res.status(200).json(response.data.data.url);
      });
  } catch (error) {
    res.json({ errors: error });
  }
});

router.post("/purchase", function (req, res, next) {
  try {
    console.log("llego 1");
    console.log(req.body);
    // variables
    const Data = req.body.data;
    console.log(Data);
    let reference = Data.payment.reference;
    let status = Data.payment.status.text;
    let transactionId = Data.checkout.uid;
    let paymentMethod = Data.source.type;
    let total = Data.payment.total;
    total = parseFloat(total); // string to number

    // Edit purchase by id
    Purchases.findByIdAndUpdate(
      reference,
      {
        $set: {
          status: status,
          paymentMethod,
          total,
          transactionId,
        },
      },
      { new: true },
      function (err, purchase) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.status(200).json(purchase);
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ errors: error });
  }
});

module.exports = router;
