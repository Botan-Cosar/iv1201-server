'use strict';

const DAO = require('../integration/dao');
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
  findPerson(id) {
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

  getApplications(){
    return this.dao.findAllApplications();
  }
}
module.exports = Controller;
