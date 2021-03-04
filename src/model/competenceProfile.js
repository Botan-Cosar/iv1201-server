'use strict';

const Sequelize = require('sequelize');
const Person=require('./person');
const Competence=require('./competence');

/**
 * A CompetenceProfile.
 */
class CompetenceProfile extends Sequelize.Model {
  /**
   * The name of the CompetenceProfile model.
   */
  static get COMPETENCE_PROFILE_MODEL_NAME() {
    return 'competence_profile';
  }

  /**
   * Defines the CompetenceProfile entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the CompetenceProfile entity.
   */
  static createModel(sequelize) {
    CompetenceProfile.init(
        {
          competence_profile_id:{
            type:Sequelize.BIGINT,
            primaryKey:true,
            autoIncrement:true,
          },
          years_of_experience: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: CompetenceProfile.COMPETENCE_PROFILE_MODEL_NAME,
          paranoid: false,
          freezeTableName:true,
          createdAt:false,
          updatedAt:false,
          deletedAt:false,
          /*indexes:[{
              unique: true,
              fields: ['person_id', 'competence_id']
          }]*/
        }
    );
    CompetenceProfile.belongsTo(Person,{
      foreignKey:'person_id',
    });
    Person.hasMany(CompetenceProfile,{
      foreignKey:'person_id',
    });

    CompetenceProfile.belongsTo(Competence,{
      foreignKey:'competence_id',
    });
    Competence.hasMany(CompetenceProfile,{
      foreignKey:'competence_id',
    });

    return CompetenceProfile;
  }
}

module.exports = CompetenceProfile;