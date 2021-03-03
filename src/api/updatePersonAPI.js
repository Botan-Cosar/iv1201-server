'use strict';
const jwt = require("jsonwebtoken");

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');
const Logger = require('./../util/logger.js');

/**
 * Defines the REST API with endpoints related to persons.
 */
class UpdatePersonApi extends RequestHandler {
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
    return UpdatePersonApi.UPDATEPERSON_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get UPDATEPERSON_API_PATH() {
    return '/updateperson';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      this.router.get(
        '/', Authorizer.verifyUpdatePerson,
        async (req, res, next) => {
          try {
            if(!req.body.auth){
              return new Error("No authentication in GET request body");
            }
            let response = {};
            await this.contr.personNeedsToFillEmptyFields(req.body.auth).then(e => {
              response.emptyFields = e;
              this.sendHttpResponse(res,200,response);
            });
          }
          catch (err) {
            next(err);
          }
        }
    );

      //THIS HAPPENS IN PERSONAPI PUT
      // /**
      //  * Sets the password of a user defined by email
      //  *
      //  * @return {obj} http response with code 200 for a sucessful password change.
      //  *                                       500 for internal server error. Something went wrong.
      //  * @throws ???
      //  */
      // this.router.post(
      //   '/', Authorizer.verifyUpdatePerson,
      //   async (req,res,next)=>{
      //     console.log("trying to access post");
      //     let token = req.body.token;
      //     let password = req.body.password;
      //     if(token){
      //       try {
      //         jwt.verify(token, process.env.JWT_PUT_SECRET, (err, tokenData) => {
      //           if(err){
      //             console.log("Invalid or expired link!");
      //             return res.status(403).send("Invalid or expired link!");
      //           }
      //           else{
      //             if(this.contr.setPersonPassword(tokenData.email, password)){
      //               let response = {}
      //               console.log("New password for " + tokenData.email + " was set.");
      //               //Logger.logMessage("New password for " + tokenData.email + " was set.");
      //               this.sendHttpResponse(res,200,response);
      //             }
      //             else{
      //               console.log("Trying to set password");
      //               this.sendHttpResponse(res,500,response);
      //             }
      //             next();
      //           }
      //         });
      //       }
      //       catch (err) {
      //         next(err);
      //       }
      //     }
      //     else{
      //       throw new Error("Invalid or expired link!");
      //     }
      //   }
      // );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = UpdatePersonApi;
