var jwt = require("jsonwebtoken");
const JWT_Secret = "thisIsASecret";

//middleware
const fetchuser = (req, res, next) => {
  //here auth-token is a name we are providing ie on the client side token would be stored in auth-token : ""
  //we are retrieving token from the client side stored in header.
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token." });
  }
  try {
    //In Node.js, particularly with the jsonwebtoken package, jwt.verify() is used to decode and validate a JWT (JSON Web Token). It ensures that the token is correctly signed and has not been tampered with.If valid, it returns the decoded token (payload).If invalid, it throws an error.
    const data = jwt.verify(token, JWT_Secret);
    //This line attaches the decoded user data from the JWT token to the req object, so that the next middleware or route handler can access it.
    //now the user id that is unique is attached to the request in decoded format which can be used by the next function i.e we decoded the id again and this can be used by us to retrieve the user form database.
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token." });
  }
};

module.exports = fetchuser;
