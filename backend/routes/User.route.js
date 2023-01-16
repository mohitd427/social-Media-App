const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: hash,
        });
        await user.save();
        res.send("Registered Successfully");
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ err: "Something went wrong while registering" });
  }
});

// "name":"chunnu",
//   "email":"chunnu@gmail.com",
//   "gender":"male",
//   "password":"chunnu123"

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });
        const hash_pass = user[0].password;
        if (user.length > 0) {
            bcrypt.compare(password, hash_pass,(err, result)=>{
              // result == true
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, process.env.jwtKey);
                    res.send({msg:"Login Successfull",token:token})
                } else {
                    res.send({err:"wrong Credentials"})
                }
            });
        } else {
            res.send({ err: "Wrong Credentials" });
            
        }
    } catch (err) {
        console.log(err);
        res.send({ err: "Something went wrong while loging in" });
    }    
})

module.exports = {
  userRouter,
};
