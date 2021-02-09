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

  login(person){
    return this.dao.login(person);
  }
}
module.exports = Controller;
