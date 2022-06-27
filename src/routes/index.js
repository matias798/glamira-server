var express = require("express");
var router = express.Router();
var axios = require("axios");
const Products = require("./../Models/Products");
const Purchases = require("./../Models/Purchases");
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
        name: `${req.body.name}`,
        identification: `${req.body.dni}`,
        email: `${req.body.email}`,
      },

      return_url: `https://glamira-server.herokuapp.com/purchase`,
      webhook: `https://glamira-server.herokuapp.com/purchase`,
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
        res.status(200).json(response.data);
      });
  } catch (error) {
    console.log(error);
    res.json({ errors: error });
  }
});

/* () -> creates purchase order in the db */
router.get("/purchase/", function (req, res, next) {
  try {
    var state = req.query.status; // state of payment
    var PaymentMethod = req.query.status; // PaymentMethod from params
    var transactionId = req.query.transactionId; // transactionId from params

    /*
      Store the state of the payment 
     */
    if (state === "200") {
      state = "paid";
    } else if (state === "1") {
      state = "cancelled";
    } else if (state === "400") {
      state = "failed";
    }
    // if state is 400, then payment was failed
    else if (state === "0") {
      state = "cancelled";
    }

    /*
     Store the type of payment method used
     */
    if (PaymentMethod === "cash") {
      PaymentMethod = "cash";
    } else if (PaymentMethod === "card") {
      PaymentMethod = "card";
    } else if (PaymentMethod === "bank_transfer") {
      PaymentMethod = "bank_transfer";
    } else {
      PaymentMethod = "none";
    }

    // create a new purchase in the DB
    var purchase = new Purchases({
      state,
      PaymentMethod,
      transactionId,
    });

    // save the purchase
    purchase.save(function (err, purchase) {
      if (err) {
        console.log(err);
        res.status(400).send(err).redirect("https://glamira-frontend.web.app/");
      }

      // Redirect to the React app after payment
      res.status(200).redirect("https://glamira-frontend.web.app/");
    });
  } catch (error) {
    console.log(error);
    res.json({ errors: error });
  }
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

module.exports = router;
