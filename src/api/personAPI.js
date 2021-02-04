'use strict';

const RequestHandler = require('./RequestHandler');

/**
 * Defines the REST API with endpoints related to persons.
 */
class PersonApi extends RequestHandler {
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
    return PersonApi.PERSON_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get PERSON_API_PATH() {
    return '/person';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();
      /*
       * Returns the specified person.
       *
       * parameter id The id of the person that shall be returned.
       * return 200: The searched person.
       *        404: If the specified person did not exist.
       */
      this.router.get(
          '/:id',
          async (req, res, next) => {
            try {
              const person = await this.contr.findPerson(parseInt(req.params.id, 10));
              if (person === null) {
                this.sendHttpResponse(res, 404, 'No such person');
                return;
              }
              this.sendHttpResponse(res, 200, person);
            } catch (err) {
              next(err);
            }
          }
      );
    } catch (err) {
      //this.logger.logException(err);
    }
  }
}

module.exports = PersonApi;
