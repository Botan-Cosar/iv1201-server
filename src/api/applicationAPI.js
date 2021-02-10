'use strict';

const RequestHandler = require('./requestHandler');

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

      this.router.post(
        '/',
        async (req,res,next)=>{
          try {
            const response=await this.contr.submitApplication(req.body);
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
    } catch (err) {
      console.error(err);
      //this.logger.logException(err);
    }
  }
}

module.exports = ApplicationApi;
