'use strict';

const Sequelize = require('sequelize');

/**
 * A Person.
 */
class Person extends Sequelize.Model {
  /**
   * The name of the Person model.
   */
  static get PERSON_MODEL_NAME() {
    return 'person';
  }

  /**
   * Defines the Person entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Person entity.
   */
  static createModel(sequelize) {
    Person.init(
        {
          person_id:{
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
          name:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          surname:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          ssn:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          email:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          password:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          role_id:{
            type:Sequelize.BIGINT,
            allowNull:false,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: Person.PERSON_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          createdAt:false,
          updatedAt:false,
          deletedAt:false,
        }
    );
    return Person;
  }
}

module.exports = Person;