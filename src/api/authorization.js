const jwt = require("jsonwebtoken");

/*
  Format of token (header: key):
  Authorization: Bearer ACCESS_TOKEN
*/

/*
  NEEDED ADDITIONS:
  Redirect the user to login if invalid token
  Add logging
  (take username and role_id from token and include it in the request
  to later be used in the coming next() function?)
*/

/**
 * Middleware to verify a token. Used before accessing pages
 * where confirmation is neeeded.
 * @param {req} req The express Request object.
 * @param {res} res The express Response object.
 * @param {next} next The next function to execute.
 */
function verifyToken(req, res, next){
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== "undefined"){
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if(err){
        return res.status(403).send("Invalid token!");
      }
      else{
        //add logging (token accepted)
        req.body.auth = authData.person;
        console.log(req.body);
        next();
      }
    });
  }
  else{
    return res.status(403).send("Unauthorised 2!");
  }
}

module.exports = verifyToken;
