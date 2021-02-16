'use strict';
const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');

/**
 * Defines the REST API with endpoints related to persons.
 */
class ForgotPasswordApi extends RequestHandler {
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
    return ForgotPasswordApi.FORGOTPASSWORD_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get FORGOTPASSWORD_API_PATH() {
    return '/forgotpassword';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      /**
       * Checks if the user's authorize header token is still valid.
       *
       * @return {obj} http response with code 200 including the user's
       *               username, role, name and verification token.
       *               403: invalid token error
       * @throws ???
       */
      this.router.get(
        '/:email',
        async (req,res,next)=>{
          let email = req.params.email;
          if(email){
            try {
              console.log("reset password...");
              console.log(req.protocol);
              let response = {}
              jwt.sign({email: email}, process.env.JWT_RESET_SECRET, {expiresIn: '30m'}, (err, token) => {
                response.resetLink = "https://iv1201-g14.web.app/" + "setpassword/" + token;
                console.log(response);
                this.sendHttpResponse(res,200,response);
              })
            }
            catch (err) {
              next(err);
            }
          }
          else{
            throw new Error("No email in request");
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ForgotPasswordApi;
