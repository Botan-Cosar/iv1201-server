'use strict';

const Sequelize = require('sequelize');

/**
 * A Competence.
 */
class Competence extends Sequelize.Model {
  /**
   * The name of the Competence model.
   */
  static get COMPETENCE_MODEL_NAME() {
    return 'competence';
  }

  /**
   * Defines the Competence entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Competence entity.
   */
  static createModel(sequelize) {
    Competence.init(
        {
          competence_id:{
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
        },
        {
          sequelize,
          modelName: Competence.COMPETENCE_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          createdAt:false,
          updatedAt:false,
          deletedAt:false,
        }
    );
    return Competence;
  }
}

module.exports = Competence;
