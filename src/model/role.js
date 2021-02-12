'use strict';

const Sequelize = require('sequelize');

/**
 * A Role.
 */
class Role extends Sequelize.Model {
  /**
   * The name of the Role model.
   */
  static get ROLE_MODEL_NAME() {
    return 'role';
  }

  /**
   * Defines the Role entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Role entity.
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
