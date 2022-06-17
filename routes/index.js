var express = require("express");
var router = express.Router();
var axios = require("axios");
const Products = require("./../Models/Products");
const Purchases = require("./../Models/Purchases");
/* GET All Products */
router.get("/all-products", function (req, res, next) {
  Products.find({}, function (err, products) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.status(200).json(products);
  });
});

// route to get only first 10 products
router.get("/first-10-products", function (req, res, next) {
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

/* payment method with mobbex */
router.post("/payment", function (req, res, next) {
  try {
    // get currnent day
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1; //January is 0!
    var year = today.getFullYear();

    var data = JSON.stringify({
      total: req.body.total,
      test: true,
      description: "Congratulations! You have successfully paid",
      due: {
        day,
        month,
        year,
      },
      currency: "ARS",
      secondDue: {
        days: 10,
        surcharge: 30,
      },
      actions: [
        {
          icon: "attachment",
          title: "Factura",
          url: "https://speryans.com/mifactura/123",
        },
      ],

      customer: {
        name: "Speryans",
        identification: "42868541",
        email: "matiasquiroga584@gmail.com",
      },

      return_url: "http://localhost:3001/purchase",
      webhook: "http://localhost:880/purchase",
      reference: "mi_referencia_123",
      options: {
        smsMessage: "We sent you the generated order for your purchase",
      },
    });

    axios
      .post("https://api.mobbex.com/p/checkout", data, {
        headers: {
          "x-api-key": "zJ8LFTBX6Ba8D611e9io13fDZAwj0QmKO1Hn1yIj",
          "x-access-token": "d31f0721-2f85-44e7-bcc6-15e19d1a53cc",
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
        console.log(response.data);
        res.send(response.data);
      });
  } catch (error) {
    console.log(error);
    res.json({ errors: error });
  }
});

module.exports = router;
