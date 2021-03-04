'use strict';

const RequestHandler = require('./requestHandler');
const Authorizer = require('./authorization.js');
const Validators = require('../util/validators');

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
      /**
       * Saves a specified person in the database.
       * @return {obj} 200: Success object with the newly created person inside.
       *               404: If the specified person could not be saved.
       * @throws ???
       */
      this.router.post(
        '/',
        async (req,res,next)=>{
          try {
            Validators.isAlphanumericString(req.body.username, 'username');
            //Check if unique fields are unique.
            const usernameTaken = await this.contr.findPersonByUsername(req.body.username);
            const emailTaken = await this.contr.findPersonByEmail(req.body.email);

            if(usernameTaken == null && emailTaken == null){
              const response=await this.contr.savePerson(req.body);
              if(response===null){
                this.sendHttpResponse(res,404,'Could not save person');
                return;
              }
              this.sendHttpResponse(res,200,response);
            }
            else{
              if(usernameTaken)
                this.sendHttpResponse(res,406,'Could not create account, not unique username');
              else if(emailTaken)
                this.sendHttpResponse(res,406,'Could not create account, not unique email');
            }
          } catch (err) {
            next(err);
          }
        }
      );

      /**
       * Updates the accessing user in the database.
       * @return {obj} 200: Success object with the newly updated person inside.
       *               404: If the specified person to update could not be found.
       * @throws ???
       */
      this.router.put(
        '/', Authorizer.verifyUpdatePerson,
        async (req,res,next)=>{
          let auth = req.body.auth;
          try {
            let person_id;
            await this.contr.findPersonIdByAuth(auth).then((e) => person_id = e);
            if(!person_id){
              console.log("person_id: " + person_id + " could not be found");
              this.sendHttpResponse(res,404,'Could not find person');
              return;
            }
            delete req.body.auth;
            const response=await this.contr.updatePerson(person_id, req.body);

            this.sendHttpResponse(res,200,response);
          } catch (err) {
            next(err);
          }
        }
      );

       /**
        * Returns the specified person.
        *
        * @param {int} id The id of the person that shall be returned.
        * @return {obj} 200: The searched person.
        *               404: If the specified person did not exist.
        * @throws ???
        */
      this.router.get(
          '/:id', Authorizer.verifyToken, Authorizer.isRecruiter,
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
