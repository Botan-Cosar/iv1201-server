'use strict';

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');
const Logger = require('./../util/logger.js');

/**
 * Defines the REST API with endpoints related to persons.
 */
class ApplicationApi extends RequestHandler {
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
    return ApplicationApi.APPLICATION_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get APPLICATION_API_PATH() {
    return '/application';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      /**
        * Gets all applications.
        *
        * @return {obj} 200: The success object.
        *               404: If the applications could not be retrieved.
        * @throws ???
        */
      this.router.get('/', Authorizer.verifyToken, Authorizer.isRecruiter,
        async (req,res,next)=>{
          try {
            const response=await this.contr.getApplications();
            if(response===null){
              this.sendHttpResponse(res,404,'Could not get applications');
              Logger.logError(new Error("Could not get applications"));
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            Logger.logError(err);
          }
        })

      /**
        * Handles application submissions.
        *
        * @return {obj} 200: The success object.
        *               404: If the application could not be submitted.
        * @throws ???
        */
      this.router.post(
        '/', Authorizer.verifyToken,
        async (req,res,next)=>{
          try {
            const username=req.body.auth.username;
            const response=await this.contr.submitApplication({username,...req.body});
            if(response===null){
              this.sendHttpResponse(res,404,'Could not submit application');
              Logger.logError(new Error("Username: \"" + username + "\" could not submit application"));
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            Logger.logError(err);
          }
        }
      );

      /**
        * Handles application acceptance and rejections.
        *
        * @return {obj} 200: The success object.
        *               404: If the application could not be updated.
        * @throws ???
        */
       this.router.put(
        '/:id', Authorizer.verifyToken, Authorizer.isRecruiter,
        async (req,res,next)=>{
          try {
            const response=await this.contr.updateApplication({...req.body,availability_id:req.params.id});
            if(response===null){
              this.sendHttpResponse(res,404,'Could not update application');
              Logger.logError(new Error("Could not update application"));
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            Logger.logError(err);
          }
        }
      );
    } catch (err) {
      Logger.logError(err);
    }
  }
}

module.exports = ApplicationApi;
