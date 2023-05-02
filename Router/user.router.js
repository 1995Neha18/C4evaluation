const express = require("express");
const router = express.Router();
const Usermodel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  let userdata = await Usermodel.find();
  res.send(userdata);
});

router.post("/register", async (req, res) => {
  const { password, email } = req.body;
  let user = await Usermodel.findOne({ email });

  if (user) {
    return res.send({ msg: "User is already Registred with this emailid" });
  }
  try {
    user = new Usermodel(req.body);
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(500).send({ err: err.message });
      } else {
        user.password = hash;
        await user.save();
        res.send({ msg: "user has been registered" });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = await Usermodel.findOne({ email });

  if (!user) {
    return res.send({
      msg: "User is not exist with this email please register first",
    });
  }
  try {
    let userdata = await bcrypt.compare(password, user.password);
    if (!userdata) {
      return res.status(400).send({ msg: "invilde crendentials" });
    } else {
      const token = jwt.sign({ autherId: user._id }, "sagar", {
        expiresIn: "1h",
      });
      res.send({ msg: "User login successfully", token });
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

module.exports = router;