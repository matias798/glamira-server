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

    if (userExist) {
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
  try {
    // Check if user exist
    const user = await User.findOne({ name: req.body.userName });

    // Check if password is correct
    const isMatch = await bcrypt.compareSync(
      req.body.password,
      user.password,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: err.message });
        }
        return result;
      }
    );

    // if password is wrong -> return error
    if (!isMatch) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    // pasword matches
    if (isMatch) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        identification: user.identification,
        purchases: user.purchases,
      };

      // create token
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "3h",
      });

      res.status(200).json(token);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// Route to get orders of a user by id
router.get("/orders", async (req, res) => {
try{
  // todo add try and catch
  let orders = [];
  // Decoded user token
  const decode = jwt.verify(
    req.header("authorization"),
    process.env.SECRET_KEY
  );

  // find user by id
  let user = await User.findById(decode.id);

  // if user !exists -> return error
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  // find purchase by id
  const purchase = await Purchase.find({ _id: user.purchases });

  // if !purchase -> return error
  if (!purchase) {
    res.status(400).json({ message: "Purchase not found" });
  }

  // loop all purchases
  for (let i = 0; i < user.purchases.length; i++) {
    let product = await Products.find({ _id: purchase[i].items });
    orders.push({ products: product, purchase: purchase[i] });
  }

  // if !orders -> return error
  if (orders.length === 0) {
    res.status(200).json({ message: "No orders yet" });
  }

  console.log(orders);
  res.status(200).json(orders);
}
 catch (err) {
  console.log(err);
  res.status(400).json({ message: err.message });
}

});

module.exports = router;
