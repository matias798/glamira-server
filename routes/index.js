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

module.exports = router;
