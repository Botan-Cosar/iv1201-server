'use strict';

const Sequelize = require('sequelize');

/**
 * A Person.
 */
class Role extends Sequelize.Model {
  /**
   * The name of the Person model.
   */
  static get ROLE_MODEL_NAME() {
    return 'role';
  }

  /**
   * Defines the Person entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Person entity.
   */
  static createModel(sequelize) {
    Role.init(
        {
          role_id:{
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
          name:{
            type:Sequelize.STRING,
            allowNull:false,
          },
        },
        {
          sequelize,
          modelName: Role.ROLE_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          createdAt:false,
          updatedAt:false,
          deletedAt:false,
        }
    );
    return Role;
  }
}

module.exports = Role;