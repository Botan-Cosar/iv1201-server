'use strict';

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');
const Logger = require('./../util/logger.js');


/**
 * Defines the REST API with endpoints related to competences (job positions).
 */
class CompetenceAPI extends RequestHandler {
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
    return CompetenceAPI.COMPETENCE_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get COMPETENCE_API_PATH() {
    return '/competence';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

       /**
        * Returns the specified person.
        *
        * @param {int} id The id of the person that shall be returned.
        * @return {obj} 200: The searched person.
        *               404: If the specified person did not exist.
        * @throws ???
        */
      this.router.get(
          '/list', Authorizer.verifyToken,
          async (req, res) => {
            try {
              const competenceList = await this.contr.getAllCompetences();
              if (competenceList === null) {
                Logger.logError(new Error("No competences found in database."));
                this.sendHttpResponse(res, 404, 'No competences found');
                return;
              }

              this.sendHttpResponse(res, 200, competenceList);
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

module.exports = CompetenceAPI;
