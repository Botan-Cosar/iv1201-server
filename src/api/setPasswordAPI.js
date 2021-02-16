'use strict';
const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');

/**
 * Defines the REST API with endpoints related to persons.
 */
class SetPasswordApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  get path() {
    return SetPasswordApi.SETPASSWORD_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get SETPASSWORD_API_PATH() {
    return '/setPassword';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      this.router.post(
        '/',
        async (req,res,next)=>{
          let token = req.body.token;
          console.log(req.body);
          if(token){
            try {
              jwt.verify(token, process.env.JWT_RESET_SECRET, (err, email) => {
                if(err){
                  console.log("Invalid or expired link!");
                  return res.status(403).send("Invalid or expired link!");
                }
                else{
                  console.log("correct link...");
                  console.log("setting new password...");
                  let response = {}
                  this.sendHttpResponse(res,200,response);
                  next();
                }
              });
            }
            catch (err) {
              next(err);
            }
          }
          else{
            throw new Error("Invalid or expired link!");
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SetPasswordApi;
