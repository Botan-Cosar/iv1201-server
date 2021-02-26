'use strict';

const Sequelize = require('sequelize');
const PersonDTO = require('../model/personDTO');
const Person = require('../model/person');
const Role = require('../model/role');
const CompetenceProfile=require('../model/competenceProfile');
const Competence=require('../model/competence');
const Availability=require('../model/availability');
const CompetenceTranslation=require('../model/competenceTranslation');
const Validators = require('../util/validators');

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
          protocol: 'postgres',
          logging: process.env.LOG_SEQUALIZE === "true" ? console.log : false
      });
    }
    else{
      this.database = new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASS,
          {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            port:process.env.DB_PORT,
            logging: process.env.LOG_SEQUALIZE === "true" ? console.log : false
          }
      );
    }
    console.log("logging \"LOG_SEQUALIZE\": " + (process.env.LOG_SEQUALIZE === "true" ? "true" : "false"));

    Role.createModel(this.database);
    Person.createModel(this.database);
    Competence.createModel(this.database);
    CompetenceProfile.createModel(this.database);
    CompetenceTranslation.createModel(this.database);
    Availability.createModel(this.database);
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
    } catch (error) {
        throw new Error('Could not connect to database.' + error.message);
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
      Validators.isPositiveInteger(id, 'id');
      const personModel = await Person.findByPk(id);
      if (personModel === null) {
        return null;
      }
      return this.createPersonDto(personModel);
    } catch (error) {
          throw new Error("could not find person." + error.message);
    }
  }

  /**
   * Searches for a person with the specified email.
   *
   * @param {string} email The email of the searched person.
   * @return {number} The person dto with the specified email, or null if there was
   *                  no such person.
   * @throws Throws an exception if failed to search for the specified person.
   */
  async findPersonByEmail(email) {
    try {
      Validators.isEmailValid(email);
      const personModel = await Person.findOne({
        where:{
          email,
        }
      });
      if (personModel === null) {
        return null;
      }
      return this.createPersonDto(personModel);
    } catch (error) {
          throw new Error("could not find person." + error.message);
    }
  }

  /**
   * Searches for a person with the specified username.
   *
   * @param {string} username The username of the searched person.
   * @return {number} The person dto with the specified email, or null if there was
   *                  no such person.
   * @throws Throws an exception if failed to search for the specified person.
   */
  async findPersonByUsername(username) {
    try {
      Validators.isStringNonZeroLength(username, 'username');
      Validators.isAlphanumericString(username, 'username');
      const personModel = await Person.findOne({
        where:{
          username,
        }
      });
      if (personModel === null) {
        return null;
      }
      return this.createPersonDto(personModel);
    } catch (error) {
          throw new Error("could not find person." + error.message);
    }
  }

  /**
   * Searches for a person id with the specified username.
   *
   * @param {string} username The username of the searched person.
   * @return {number} The person id with the specified username, or null if there was
   *                  no such person.
   * @throws Throws an exception if failed to find the specified person.
   */
  async findPersonIdByUsername(username) {
    try {
      Validators.isStringNonZeroLength(username, 'username');
      Validators.isAlphanumericString(username, 'username');
      const personModel = await Person.findOne({
        where:{
          username,
        }
      });
      if (personModel === null) {
        return null;
      }
      return personModel.person_id;
    } catch (error) {
          throw new Error("could not find person." + error.message);
    }
  }

  /**
   * Finds a person by using the authentication data, which includes email, username and role_id.
   * @param  {object} auth The authenticaiton object.
   * @return {number} The ID of the user
   *
   * @throws Throws an exception if failed to find the specified person.
   */
  async findPersonIdByAuth(auth){
    try {
      let personModel;
      if(auth.username){
        personModel = await Person.findOne({
          where:{
            username: auth.username,
          }
        });
      }
      else if(auth.email){
        personModel = await Person.findOne({
          where:{
            email: auth.email,
          }
        });
      }
      if (personModel === null) {
        return null;
      }

      return personModel.person_id;
      }
      catch (error) {
            throw new Error("could not find person." + error.message);
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
       throw new Error("Could not create person." + error.message);
     }
   }


   /**
    * Updates the user's data in the database.
    * @param  {number}  person_id The unique (PK) id of the user.
    * @param  {object}  person    The object including the data to update.
    * @return {object}           Success object with the newly saved person inside.
    *
    * @throws Throws an exception if failed to update the person.
    */
   async updatePerson(person_id, person){
     try {
       Validators.isPositiveInteger(person_id, 'person_id');
       return Person.update({
         name: person.name,
         surname: person.surname,
         ssn: person.ssn,
         email: person.email,
         password: person.password,
         username: person.username
       },{
         where: {
           person_id
         }
       });
     } catch (error) {
       throw new Error("could not create person." + error.message);
     }
   }

  /**
   * Logs in the user
   *
   * @param {Object} person The person trying to log in.
   * @return {personDTO} success object with the logged in user's personDTO.
   *
   * @throws Throws an "could not log in" exception if failed to log in.
   */
  async login(person){
    try {
      const personModel=await Person.findOne({
        where:{
          username:person.username,
          password:person.password
        }
      });
      if (personModel === null) {
        return null;
      }
      let returnObject = {
        username: personModel.username,
        email: personModel.email,
        role_id: personModel.role_id
      };
      console.log(returnObject);
      return this.createPersonDto(returnObject);
    } catch (error) {
      throw new Error("could not login." + error.message);
    }
  }

  /**
   * Updates a competence profile if a matching person_id and competence_id already exists. Creates a new entry otherwise.
   *
   * @param {number} person_id The id of the person
   * @param {Array} competence A competence id along with years of experience.
   *
   * @throws Throws a "could not save competence profile." exception if failed to create competence profile.
   */
  async updateOrCreateCompetenceProfile(person_id,competence){
    try {
      Validators.isPositiveInteger(person_id, 'person_id');
      const {competence_id,years_of_experience}=competence;
      const competenceProfile={person_id,competence_id,years_of_experience};
      const updatedEntry=await this.updateCompetenceProfile(competenceProfile);
      if(updatedEntry[0]===0){
        await this.createCompetenceProfile(competenceProfile);
      }
    } catch (error) {
      throw new Error("could not save competence profile." + error.message);
    }
  }

  /**
   * Updates a competence profile entry.
   *
   * @param {Object} object Consists of: person_id, competence_id, and years_of_experience
   * @return {Array} Array of updated entries.
   *
   * @throws Throws a "could not update competence profile." error if the entry could not be updated.
   */
  async updateCompetenceProfile({person_id,competence_id,years_of_experience}){
    try {
      const competenceModel=await CompetenceProfile.update({
        years_of_experience
      },{
        where:{
          person_id,
          competence_id
        }
      });
      return competenceModel;
    } catch (error) {
      throw new Error("could not update competence profile." + error.message);
    }
  }

  /**
   * Saves a competence profile entry.
   *
   * @param {Object} competenceProfile Consists of: person_id, competence_id, and years_of_experience
   * @return {Object} The newly created competence_profile.
   *
   * @throws Throws a "could not create competence profile." error if the entry could not be created.
   */
  async createCompetenceProfile(competenceProfile){
    try {
      const competenceModel=await CompetenceProfile.create(competenceProfile);
      return competenceModel;
    } catch (error) {
      throw new Error("could not create competence profile." + error.message);
    }
  }

  /**
   * Saves an availability entry.
   *
   * @param {number} person_id The id of the person.
   * @param {Array} period Consists of the start date and end date.
   * @return {Object} The newly created availability.
   *
   * @throws Throws a "could not create availability." error if failed to be created.
   */
  async createAvailability(person_id,period){
    try {
      Validators.isPositiveInteger(person_id, 'person_id');
      const {from_date,to_date}=period;
      const availabilityModel=await Availability.create({
        person_id,
        from_date,
        to_date,
        version_number:0
      });
      return availabilityModel;
    } catch (error) {
      throw new Error("could not create availability." + error.message);
    }
  }

  /**
   * Finds all applications.
   *
   * @return {Object} All applications.
   *
   * @throws Throws a "could not find all applications." error if failed to find all applications.
   */
  async findAllApplications(){
    try {
      const applicationModel = await Availability.findAll({
        attributes:["availability_id","from_date","to_date","createdAt","application_status","version_number"],
        include:{
          model:Person,
          attributes:["name","surname"],
          required:true,
          include:{
            model:CompetenceProfile,
            attributes:["years_of_experience"],
            required:true,
            include:{
              model:Competence,
              required:true,
              include:{
                model:CompetenceTranslation,
                required:true,
                separate:true,
                attributes:["language", "translation"],
              },
            }
          }
        }
      });
      console.log(JSON.stringify(applicationModel));
      return applicationModel;
    } catch (error) {
      throw new Error("could not find all applications." + error.message);
    }
  }

  /**
   * Set password of person based on email.
   * @param  {string} email The person's email
   * @param  {string} password The new password to set.
   *
   * @throws Throws a "Could not set user password" error if failed to set password or find person.
   */
  async setPersonPassword(email, password){
    try {
      Validators.isEmailValid(email);
      Validators.isStringNonZeroLength(password, 'password');
      const personModel = await Person.update({
        password: password,
      },{
        where:{
          email: email,
        }
      });
    } catch (error) {
      throw new Error("Could not set user password" + error.message);
    }

  }

  /**
   * Updates the application status of a specified availability.
   *
   * @param {number} id The availability id.
   *
   * @throws Throws a "Could not update application" error if failed to update application.
   */
  async updateApplication({availability_id,application_status,version_number}){
    try {
      const currentVersion=await Availability.findByPk(availability_id,{attributes:["version_number"]});
      if(currentVersion.version_number!=version_number){
        throw new Error("Version number expired. Current version: " + currentVersion.version_number);
      }
      const availabilityModel=await Availability.update({
        application_status,
        version_number:version_number+1
      },{
        where:{
          availability_id
        }
      });
      return availabilityModel;
    } catch (error) {
      throw new Error("Could not update application" + error.message);
    }
  }

  async getAllCompetences(){
    try{
      return await Competence.findAll({
          required:true,
          include:{
            model:CompetenceTranslation,
            required:true,
            separate:true,
            attributes:["language", "translation"],
          }
      });
    }
    catch(error){
      throw new Error("Could not get competences" + error.message);
    }
  }

  /**
   * Creates a person DTO
   * @param  {object} personModel The model representing the person from the database.
   * @return {object} The person DTO.
   */
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
