'use strict';
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
              this.sendHttpResponse(res, 404, "No authentication in GET request body");
            }
            let response = {};
            await this.contr.personNeedsToFillEmptyFields(req.body.auth).then(e => {
              response.emptyFields = e;
              this.sendHttpResponse(res,200,response);
            });
          }
          catch (err) {
            this.sendHttpResponse(res, 404, "No authentication in GET request body");
            next(err);
          }
        }
    );
    } catch (err) {
      Logger.logError(err);
    }
  }
}

module.exports = UpdatePersonApi;
