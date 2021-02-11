'use strict';

const RequestHandler = require('./requestHandler');
const VerifyToken = require('./authorization.js');

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
    //console.log("In PersonAPI's registerHandler");
    try {
      //console.log("before retrieveController");
      await this.retrieveController();

      /**
       * Saves a specified person in the database.
       * return 200: Success object with the newly created person inside.
       *        404: If the specified person could not be saved.
       */
      this.router.post(
        '/',
        async (req,res,next)=>{
          try {
            const response=await this.contr.savePerson(req.body);
            if(response===null){
              this.sendHttpResponse(res,404,'Could not save person');
              return;
            }
            this.sendHttpResponse(res,200,response);
          } catch (err) {
            next(err);
          }
        }
      );

      /*
       * Returns the specified person.
       *
       * parameter id The id of the person that shall be returned.
       * return 200: The searched person.
       *        404: If the specified person did not exist.
       */
      this.router.get(
          '/:id', VerifyToken,
          async (req, res, next) => {
            //console.log("personAPI in async (line 47)");
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
      console.error(err);
      //this.logger.logException(err);
    }
  }
}

module.exports = PersonApi;
