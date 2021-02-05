'use strict';

const Sequelize = require('sequelize');
const PersonDTO = require('../model/personDTO');
const Person = require('../model/person');

/**
 * This class is responsible for all calls to the database. There shall not
 * be any database-related code outside this class.
 */
class DAO {
  /**
   * Creates a new instance and connects to the database.
   */
  constructor() {
    if(process.env.NODE_ENV === "production"){
      console.log("production");
      this.database = new Sequelize(
        process.env.DATABASE_URL, {
          dialect: 'postgres',
          protocol: 'postgres'
      });
    }
    else{
      this.database = new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASS,
          {host: process.env.DB_HOST, dialect: process.env.DB_DIALECT,port:process.env.DB_PORT}
      );
    }
    Person.createModel(this.database);
  }

  /**
   * Creates non-existing tables, existing tables are not touched.
   *
   * @throws Throws an exception if the database could not be created.
   */
  async createTables() {
    try {
        console.log("before auth");
        await this.database.authenticate();
        console.log("after auth");
        await this.database.sync({force: false});
        console.log("after sync");
    } catch (err) {
        throw new Error('Could not connect to database.');
    }
  }

  /**
   * Searches for a user with the specified id.
   *
   * @param {number} id The id of the searched person.
   * @return {PersonDTO} The user with the specified id, or null if there was
   *                  no such user.
   * @throws Throws an exception if failed to search for the specified user.
   */
  async findPersonById(id) {
    try {
      const personModel = await Person.findByPk(id);
      if (personModel === null) {
        return null;
      }
      return this.createPersonDto(personModel);
    } catch (err) {
          throw "could not find person.";
    }
  }

  createPersonDto(personModel) {
    return new PersonDTO(
        personModel.person_id,
        personModel.name,
        personModel.surname,
        personModel.ssn,
        personModel.email,
        personModel.password,
        personModel.role_id,
        personModel.username,
    );
  }
}

module.exports = DAO;
