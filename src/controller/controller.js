'use strict';

const DAO = require('../integration/dao');
const HandleLackingData = require('../model/handleLackingData');
const PersonDTO = require('../model/personDTO');

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
class Controller {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.dao = new DAO();
  }

  /**
   * Instantiates a new Controller object.
   *
   * @return {Controller} The newly created controller.
   * @throws Throws and exception if connection to DB failed.
   */
  static async createController() {
    const contr = new Controller();
    await contr.dao.createTables();
    return contr;
  }

  /**
   * Returns the person with the specified id.
   *
   * @param {number} id The id of the searched person.
   * @return {PersonDTO} The person with the specified id, or null if there was no such person.
   * @throws Throws an exception if failed to search for the specified person.
   */
  findPersonById(id) {
    return this.dao.findPersonById(id);
  }

  /**
   * Saves a specified person in the database.
   *
   * @param {Object} person The person to register.
   * @return {Object} success object with the newly saved person inside.
   *
   * @throws Throws an exception if failed to save the person.
   */
   savePerson(person){
     person={...person,role_id:2};
     return this.dao.savePerson(person);
   }

   /**
    * Searches for a person based on email
    *
    * @param {Object} email The email to use as query.
    * @return {Object} The personDTO from database.
    *
    * @throws Throws an exception if failed to find person with email.
    */
   findPersonByEmail(email){
    return this.dao.findPersonByEmail(email);
   }

   /**
    * Searches for a person based on username
    *
    * @param {Object} username The username to use as query.
    * @return {Object} The personDTO from database.
    *
    * @throws Throws an exception if failed to find person with username.
    */
   findPersonByUsername(username){
    return this.dao.findPersonByUsername(username);
   }

   /**
    * Searches for a person's ID by using the data from authentication
    *
    * @param {Object} auth The authentication data to use as query(ies).
    * @return {Object} The personDTO from database.
    *
    * @throws Throws an exception if failed to find person with username.
    */
   findPersonIdByAuth(auth){
     return this.dao.findPersonIdByAuth(auth);
   }

   /**
    * Updates fields in database for person.
    *
    * @param {Object} person The person object including person_id.
    * @return {Object} The personDTO from database.
    *
    * @throws Throws an exception if failed to find person with email.
    */
   updatePerson(person_id, person){
     return this.dao.updatePerson(person_id, person);
   }
  /**
   * Logs in the user
   *
   * @param {Object} person The person trying to log in.
   * @return {Object} success object with the logged in user's data, including the verification token.
   *
   * @throws Throws an exception if failed to log in.
   */
  login(person){
    return this.dao.login(person);
  }

  /**
   * Submits an application from the logged in user.
   *
   * @param {Object} object consists of username, competencies, and periods of work.
   * @return {Object} success object.
   *
   * @throws Throws an exception if failed to submit the application.
   */
  async submitApplication({username,competencies,periods}){
    try {
      const person_id=await this.dao.findPersonIdByUsername(username);
      competencies.forEach(competence=>this.dao.updateOrCreateCompetenceProfile(person_id,competence));
      periods.forEach(period=>this.dao.createAvailability(person_id,period));
      return "success"
    } catch (error) {
      throw new Error("Failed to submit application.");
    }
  }
  /**
   * Sets the password of a user based on email.
   * @param {String} email The email of the user.
   * @param {String} password The password to set.
   * @return {Object} success object.
   *
   * @throws Throws an exception if failed to set password.
   */
  setPersonPassword(email, password){
    return this.dao.setPersonPassword(email, password);
  }

  /**
   * Returns all applications.
   *
   * @return {Object} success object.
   * @throws Throws an exception if failed to retrieve all applications.
   */
  getApplications(){
    return this.dao.findAllApplications();
  }

  /**
   * Checks whether or not all fields of the user is in the database or not.
   * @param  {object} obj The login object
   * @return {object} The empty fields if any, otherwise returns false.
   */
  async personNeedsToFillEmptyFields(obj){
    return HandleLackingData.personNeedsToFillEmptyFields(obj, this);
  }

  /**
   * Updates the application status of an availability.
   *
   * @param {number} id The availability id.
   * @return {Object} success object.
   *
   * @throws Throws an exception if failed to update the application.
   */
  updateApplication(params){
    return this.dao.updateApplication(params);
  }
}
module.exports = Controller;
