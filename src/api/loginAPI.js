'use strict';

const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');
const Logger = require('./../util/logger.js');
const Validators = require('../util/validators');

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
       * Checks if the user's authorize header token is still valid.
       *
       * @return {obj} http response with code 200 including the user's
       *               username, role, name and verification token.
       *               403: invalid token error
       */
      this.router.get(
        '/check_validity', Authorizer.verifyToken,
        async (req,res,next)=>{
          try {
            let response = {body: req.body.auth};
            this.sendHttpResponse(res, 200, response);
          }
          catch (err) {
            next(err);
          }
        }
      );
      
      /**
       * Logs in the user if login details match database.
       * 
       * @param {obj} req.body {
       *    "username": The username of the user,
       *    "password": The password of the user
       * }
       *
       * @return {obj} http response with code 200 including the user's
       *               username, role, name and verification token.
       *               404: Could not log in.
       */
      this.router.post(
        '/',
        async (req,res,next)=>{
          try {
            Validators.isStringNonZeroLength(req.body.username, 'username');
            Validators.isAlphanumericString(req.body.username, 'username');
            Validators.isStringNonZeroLength(req.body.password, 'password');
            Validators.isAlphanumericString(req.body.password, 'password');
            const response=await this.contr.login(req.body);
            if(response===null){
              this.sendHttpResponse(res,404,'Could not log in');
              return;
            }
            jwt.sign({person: response}, process.env.JWT_SECRET, (err, token) => {
              response.token = token;
              this.contr.personNeedsToFillEmptyFields(response).then(e => {
                if(e){
                  response.emptyFields = e;
                }
                this.sendHttpResponse(res,200,response);
              });
            })
          } catch (err) {
            this.sendHttpResponse(res,404,'Could not log in');
            Logger.logMessage("Login attempt failed for username: \"" + req.body.username + "\"");
            next(err);
          }
        }
      );
    } catch (err) {
      Logger.logError(err);
    }
  }
}

module.exports = LoginApi;
