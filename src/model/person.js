'use strict';

const Sequelize = require('sequelize');
const Role=require('./role');

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
            unique:true,
          },
          password:{
            type:Sequelize.STRING,
            allowNull:false,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true,
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
    Person.belongsTo(Role,{
      foreignKey:'role_id',
    });
    Role.hasMany(Person,{
      foreignKey:'role_id',
    });
    return Person;
  }
}

module.exports = Person;
