'use strict';

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');

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
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            next(err);
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
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            next(err);
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
            const response=await this.contr.updateApplication({application_status:req.body.application_status,availability_id:req.params.id});
            if(response===null){
              this.sendHttpResponse(res,404,'Could not update application');
              return;
            }
            this.sendHttpResponse(res,200,response);
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

module.exports = ApplicationApi;
