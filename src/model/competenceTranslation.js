'use strict';

const Sequelize = require('sequelize');
const Competence = require('./competence');

/**
 * A translation.
 */
class CompetenceTranslation extends Sequelize.Model {
  /**
   * The name of the Translation model.
   */
  static get COMPETENCE_TRANSLATION_MODEL_NAME() {
    return 'competence_translation';
  }

  /**
   * Defines the Translation entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the Translation entity.
   */
  static createModel(sequelize) {
    CompetenceTranslation.init(
        {
          translation_id: {
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
          language: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          translation: {
            type: Sequelize.STRING,
            allowNull: false,
          }
        },
        {
          sequelize,
          modelName: CompetenceTranslation.COMPETENCE_TRANSLATION_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          createdAt:false,
          updatedAt:false,
          deletedAt:false,
        }
    );
    CompetenceTranslation.belongsTo(Competence, {
      foreignKey: 'competence_id',
    })
    Competence.hasMany(CompetenceTranslation, {
      foreignKey: 'competence_id',
    })

    return CompetenceTranslation;
  }
}

module.exports = CompetenceTranslation;
