'use strict';
const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');
const Validators = require('../util/validators');
const Logger = require('./../util/logger.js');


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
       * @param {string} email The email of the user.
       * @return {obj} http response with code 200 including the user's
       *               username, role, name and verification token.
       *               403: invalid token error
       */
      this.router.get(
        '/:email',
        async (req,res,next)=>{
          let email = req.params.email;
          Validators.isEmailValid(email);
          if(email){
            try {
              const person = await this.contr.findPersonByEmail(email);
              if(person != null){
                let response = {}
                jwt.sign({email: email}, process.env.JWT_PUT_SECRET, {expiresIn: '30m'}, (err, token) => {
                  response.resetLink = process.env.REACT_URL + "updateperson/" + token;
                  Logger.logMessage("Created reset link for user \"" + person.username + "\"");
                  this.sendHttpResponse(res,200,response);
                })
              }
              else{
                Logger.logMessage("Failed to find account with email for update details, email: \"" + email + "\"");
                this.sendHttpResponse(res, 404, 'An account with that email was not found');
              }
            }
            catch (err) {
              this.sendHttpResponse(res, 404, 'An account with that email was not found');
              next(err);
            }
          }
          else{
            throw new Error("No email in request");
          }
        }
      );
    } catch (err) {
      Logger.logError(err);
    }
  }
}

module.exports = ForgotPasswordApi;
