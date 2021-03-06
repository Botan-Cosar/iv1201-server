'use strict';

const Sequelize = require('sequelize');
const Person = require('../model/person');
const Role = require('../model/role');
const CompetenceProfile=require('../model/competenceProfile');
const Competence=require('../model/competence');
const Availability=require('../model/availability');
const CompetenceTranslation=require('../model/competenceTranslation');
const Validators = require('../util/validators');
const Logger = require('./../util/logger.js');
const dtoFactory=require('../model/dtoFactory');

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
    Logger.logMessage("logging \"LOG_SEQUALIZE\": " + (process.env.LOG_SEQUALIZE === "true" ? "true" : "false"));

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
   * Searches for a person with the specified parameter.
   * 
   * @param {*} param The search parameter.
   * @return {object} The person with the specified parameter, or null if there was
   *                  no such person.
   * 
   * @throws Throws an exception if failed to search for the specified person.
   */
  async findPersonByParameter(key,param){
    try {
      const personModel = await Person.findOne({
        where:{
          [key]:param
        }
      });
      if (personModel === null) {
        return null;
      }
      return dtoFactory.createPersonDto(personModel);
    } catch (error) {
        throw new Error("could not find person." + error.message);
    }
  }

  /**
   * Searches for a person with the specified id.
   *
   * @param {number} id The id of the searched person.
   * @return {object} The person with the specified id, or null if there was
   *                  no such person.
   * @throws Throws an exception if failed to search for the specified person.
   */
  async findPersonById(id) {
    Validators.isPositiveInteger(id, 'id');
    return await this.findPersonByParameter("person_id",id);
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
    Validators.isEmailValid(email);
    return await this.findPersonByParameter("email",email);
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
    Validators.isStringNonZeroLength(username, 'username');
    Validators.isAlphanumericString(username, 'username');
    return await this.findPersonByParameter("username",username);
  }

  /**
   * Finds a person by using the authentication data, which includes email, username and role_id.
   * @param  {object} auth The authentication object.
   * @return {number} The ID of the user
   *
   * @throws Throws an exception if failed to find the specified person.
   */
  async findPersonIdByAuth(auth){
    try {
      let [key,value]=[];
      if(auth.username){
        Validators.isStringNonZeroLength(auth.username, 'username');
        Validators.isAlphanumericString(auth.username, 'username');
        [key,value]=["username",auth.username];
      }
      else if(auth.email){
        Validators.isEmailValid(email);
        [key,value]=["email",auth.email];
      }
      const {person_id}=await this.findPersonByParameter(key,value);
      return person_id;
    } catch (error) {
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
      Validators.isStringNonZeroLength(person.name, 'name');
      Validators.isAlphaString(person.name, 'name');
      Validators.isStringNonZeroLength(person.surname, 'surname');
      Validators.isAlphaString(person.surname, 'surname');
      Validators.isStringRepresentingDate(person.ssn,'ssn');
      Validators.isStringNonZeroLength(person.password, 'password');
      Validators.isAlphanumericString(person.password, 'password');
      Validators.isEmailValid(person.email,'email');
      Validators.isStringNonZeroLength(person.username, 'username');
      Validators.isAlphanumericString(person.username, 'username');
      person={...person,role_id:2};
      await Person.create(person);
      return "success";
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
      person.name&&Validators.isStringNonZeroLength(person.name, 'name');
      person.name&&Validators.isAlphaString(person.name, 'name');
      person.surname&&Validators.isStringNonZeroLength(person.surname, 'surname');
      person.surname&&Validators.isAlphaString(person.surname, 'surname');
      person.ssn&&Validators.isStringRepresentingDate(person.ssn,'ssn');
      person.password&&Validators.isStringNonZeroLength(person.password, 'password');
      person.password&&Validators.isAlphanumericString(person.password, 'password');
      person.email&&Validators.isEmailValid(person.email,'email');
      person.username&&Validators.isStringNonZeroLength(person.username, 'username');
      person.username&&Validators.isAlphanumericString(person.username, 'username');

      await Person.update({
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
      return "success";
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
      Validators.isStringNonZeroLength(person.username, 'username');
      Validators.isAlphanumericString(person.username, 'username');
      Validators.isStringNonZeroLength(person.password, 'password');
      Validators.isAlphanumericString(person.password, 'password');
      const personModel=await Person.findOne({
        where:{
          username:person.username,
          password:person.password
        },
        attributes:["username","email","role_id"],
      });
      if (personModel === null) {
        return null;
      }
      return dtoFactory.createPersonDto(personModel);
    } catch (error) {
      throw new Error("could not login." + error.message);
    }
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
    const t=await this.database.transaction({autocommit:false});
    try {
      Validators.isStringNonZeroLength(username, 'username');
      Validators.isAlphanumericString(username, 'username');
      const {person_id}=await this.findPersonByUsername(username);

      const competenceProfiles=competencies.map(c=>{
        Validators.isNumber(c.competence_id,"competence_id");
        Validators.isNumber(c.years_of_experience,"years_of_experience");
        return {person_id,...c};
      });
      const availabilities=periods.map(p=>{
        Validators.isStringRepresentingDate(p.from_date,"from_date");
        Validators.isStringRepresentingDate(p.to_date,"to_date");
        Validators.dateIsNotPastDate(p.from_date,p.to_date,"from_date","to_date");
        return {person_id,...p,version_number:0};
      });

      await CompetenceProfile.bulkCreate(competenceProfiles,{
        ignoreDuplicates:true,
        transaction:t
      });

      competenceProfiles.map(async profile=>{
        const {person_id,competence_id,years_of_experience}=profile;
        const updatedEntry=await CompetenceProfile.update({
          years_of_experience
        },{
          where:{
            person_id,
            competence_id
          },
          transaction:t
        });
        return updatedEntry;
      })

      await Availability.bulkCreate(availabilities,{transaction:t});
      t.commit();
      Logger.logMessage("Application submitted successfully for user: \"" + username + "\"");
      return "success";
    } catch (error) {
      t.rollback();
      throw new Error("Failed to submit application." + error.message);
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
      const applicationArrayModel = await Availability.findAll({
        attributes:["availability_id","from_date","to_date","createdAt","application_status","version_number"],
        include:{
          model:Person,
          attributes:["name","surname"],
          required:true,
          include:{
            model:CompetenceProfile,
            attributes:["years_of_experience"],
            required:false,
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
      return dtoFactory.createApplicationArray(applicationArrayModel);
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
      Validators.isAlphanumericString(password, 'password');
      await Person.update({
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
   * @param {number} availability_id The availability id.
   * @param {String} application_status The new status for the application.
   * @param {number} version_number The version number for the status field.
   *
   * @throws Throws a "Could not update application" error if failed to update application.
   */
  async updateApplication({availability_id,application_status,version_number}){
    try {
      Validators.isPositiveInteger(availability_id,"availability_id");
      Validators.applicationStatusIsValid(application_status,'application_status');
      Validators.isNumber(version_number,"version_number");
      const currentVersion=await Availability.findByPk(availability_id,{attributes:["version_number"]});
      Validators.versionNumberIsValid(currentVersion.version_number,version_number,"current version number","user version number");
      const nextVersionNumber=+version_number+1;
      await Availability.update({
        application_status,
        version_number:nextVersionNumber
      },{
        where:{
          availability_id
        }
      });
      return "success";
    } catch (error) {
      throw new Error("Could not update application. " + error.message);
    }
  }

  async getAllCompetences(){
    try{
      const competenceArrayModel=await Competence.findAll({
          required:true,
          include:{
            model:CompetenceTranslation,
            required:true,
            separate:true,
            attributes:["language", "translation"],
          }
      });
      return dtoFactory.createCompetenceArray(competenceArrayModel);
    }
    catch(error){
      throw new Error("Could not get competences" + error.message);
    }
  }
}

module.exports = DAO;
