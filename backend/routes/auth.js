const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_Secret = "thisIsASecret";

//ROUTE 1 : SIGNING UP creating user using POST method on api/auth/createuser,no login required
router.post(
  "/createuser",
  [
    //we use body since we are using post method to ensure security
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //handle the error that may occur
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ success, errors: result.array() });
    }
    try {
      //check if user with this email already exists.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User with this email already exists." });
      }

      //performing salting here 10 denotes the iterations of hashing algo.
      //higher the number , higher is the security
      const salt = await bcrypt.genSalt(10);
      const securedPw = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: securedPw,
        email: req.body.email,
      });

      //using JWT to generate the token
      //since data is payload it must be unique thta is why we are using id
      const data = {
        user: {
          id: user.id,
        },
      };
      //here data is payload and JWT_Secret is signature
      const authToken = jwt.sign(data, JWT_Secret);
      success = true;
      res.json({ success, authToken });
      //console.log(authToken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Some error occured");
    }
  }
);

//ROUTE 2 : creating user using POST method on api/auth/login,no login required

router.post(
  "/login",
  [
    //we use body since we are using post method to ensure security
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //handle the error that may occur
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ success, errors: result.array() });
    }
    //extracting info from request
    const { email, password } = req.body;
    try {
      //extracts the user from db
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }
      //comparing the stored pw and entered pw
      const pwCompare = await bcrypt.compare(password, user.password);
      if (!pwCompare) {
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      //here data is payload and JWT_Secret is signature
      const authToken = jwt.sign(data, JWT_Secret);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//ROUTE 3 : get logged in user details using POST method on api/auth/getuser, login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    // This line fetches user details from the database, but excludes the password field from the result.
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});
module.exports = router;
