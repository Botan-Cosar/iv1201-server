'use strict';

const Sequelize = require('sequelize');
const PersonDTO = require('../model/personDTO');
const Person = require('../model/person');
const Role = require('../model/role');
const CompetenceProfile=require('../model/competenceProfile');
const Competence=require('../model/competence');

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
    Role.createModel(this.database);
    Person.createModel(this.database);
    Competence.createModel(this.database);
    CompetenceProfile.createModel(this.database);
  }

  /**
   * Creates non-existing tables, existing tables are not touched.
   *
   * @throws Throws an exception if the database could not be created.
   */
  async createTables() {
    try {
        await this.database.authenticate();
        await this.database.sync({force: false});
    } catch (err) {
        throw new Error('Could not connect to database.');
    }
  }

  /**
   * Searches for a person with the specified id.
   *
   * @param {number} id The id of the searched person.
   * @return {PersonDTO} The person with the specified id, or null if there was
   *                  no such person.
   * @throws Throws an exception if failed to search for the specified person.
   */
  async findPersonById(id) {
    try {
      const personModel = await Person.findByPk(id,{
        include:{
          model:Role,
          required:true,
        }
      });
      //console.log(JSON.stringify(personModel));
      if (personModel === null) {
        return null;
      }
      return this.createPersonDto(personModel);
    } catch (err) {
          throw "could not find person.";
    }
  }

  /**
   * Saves a specified person in the database.
   *
   * @param {Object} person The person to register.
   * @return {Object} success object with the newly saved person inside.
   *
   * @throws Throws an exception if failed to save the person.
   */
  async savePerson(person){
    try {
      return Person.create(person);
    } catch (error) {
      throw "could not create person.";
    }
  }

  async login(person){
    try {
      const personModel=await Person.findOne({
        where:{
          username:person.username,
          password:person.password
        }
      });
      //console.log(personModel);
      if (personModel === null) {
        return null;
      }
      let returnObject = {
        username: personModel.username,
        email: personModel.email,
        role_id: personModel.role_id
      };
      return this.createPersonDto(returnObject);
    } catch (error) {
      throw "could not login.";
    }
  }

  async saveCompetence(person_id,competence){
    console.log(JSON.stringify({person_id,competence_id:competence[0],years_of_experience:competence[1]}));
    try {
      const competenceModel=await CompetenceProfile.create({person_id,competence_id:competence[0],years_of_experience:competence[1]});
      console.log(competenceModel);
    } catch (error) {
      throw "could not save competence.";
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
