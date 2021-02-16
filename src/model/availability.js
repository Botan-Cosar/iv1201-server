'use strict';

const Sequelize = require('sequelize');
const Person=require('./person');

/**
 * An Availability.
 */
class Availability extends Sequelize.Model {
  /**
   * The name of the Availability model.
   */
  static get AVAILABILITY_MODEL_NAME() {
    return 'availability';
  }

  /**
   * Defines the Availability entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Availability entity.
   */
  static createModel(sequelize) {
    Availability.init(
        {
          availability_id:{
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
          from_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          to_date:{
            type:Sequelize.DATE,
            allowNull:false,
          },
          application_status:{
            type:Sequelize.STRING,
            allowNull:true
          }
        },
        {
          sequelize,
          modelName: Availability.AVAILABILITY_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          updatedAt:false,
          deletedAt:false,
        }
    );
    Availability.belongsTo(Person,{
        foreignKey:'person_id',
    });
    Person.hasMany(Availability,{
      foreignKey:'person_id',
    });
    return Availability;
  }
}

module.exports = Availability;