// import packages
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// import Models
const User = require("./../Models/Users");
const Products = require("./../Models/Products");
const Purchase = require("./../Models/Purchases");

// Register User
router.post("/register", async (req, res) => {
  try {
    const fakeRegister = req.body.fakeRegister;

    // Check if name is already in use
    const userExist = await User.findOne({ name: req.body.userName });

    if (userExist ) {
      return res.status(200).send("User already exist");
    }

    let password = req.body.password;

    if (fakeRegister === true) {
      // random password
      password = "SDJKBDKSLFBLDSKDFRGTARE";
    } else if (password === undefined) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hashSync(password, 8);

    // Create user
    const user = new User({
      name: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      identification: req.body.identification,
    });

    // Save user in DB
    await user.save();

      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        identification: user.identification,
        purchases: user.purchases,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "3h",
      });
  
      res.status(200).json({ token });

  
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.userName });

  const isMatch = await bcrypt.compareSync(
    req.body.password,
    user.password,
    function (err, result) {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  if (isMatch) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      identification: user.identification,
      purchases: user.purchases,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "3h",
    });

    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

// Route to get orders of a user by id
router.get("/orders", async (req, res) => {
  let orders = [];
  let user = await User.findOne({ userName: req.query.user });

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  const purchase = await Purchase.find({ _id: user.purchases });

  if (!purchase) {
    res.status(400).json({ message: "Purchase not found" });
  }

  for (let i = 0; i < user.purchases.length; i++) {
    let product = await Products.find({ _id: purchase[i].items });

    orders.push({ products: product, purchase: purchase[i] });
  }

  if (orders.length === 0) {
    res.status(200).json({ message: "No orders yet" });
  }

  res.status(200).json(orders);
});

module.exports = router;
