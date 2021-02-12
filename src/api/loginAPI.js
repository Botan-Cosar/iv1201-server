'use strict';

const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');

/**
 * Defines the REST API with endpoints related to persons.
 */
class LoginApi extends RequestHandler {
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
    return LoginApi.LOGIN_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get LOGIN_API_PATH() {
    return '/login';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      /**
       * Logs in the user if login details match database
       *
       * @return {obj} http response with code 200 including the user's
       *               username, role, name and verification token.
       *               404: Could not log in.
       */
      this.router.post(
        '/',
        async (req,res,next)=>{
          try {
            const response=await this.contr.login(req.body);
            if(response===null){
              this.sendHttpResponse(res,404,'Could not log in');
              return;
            }
            jwt.sign({person: response}, process.env.JWT_SECRET, (err, token) => {
              console.log("token: " + token);
              response.token = token;
              console.log("\n" + JSON.stringify(response) + "\n");
              this.sendHttpResponse(res,200,response);
            })
          } catch (err) {
            next(err);
          }
        }
      );
    } catch (err) {
      console.error(err);
      //this.logger.logException(err);
    }
  }
}

module.exports = LoginApi;
