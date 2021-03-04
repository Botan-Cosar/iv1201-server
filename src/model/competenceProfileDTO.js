'use strict';

const Validators = require('../util/validators');

/**
 * A competence profile from the database.
 */
class CompetenceProfileDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} competence_profile_id The id of the competence profile.
   * @param {number} person_id The id of the person.
   * @param {number} competence_id The id of the competence.
   * @param {number} years_of_experience The years of experience for the competence.
   * @param {object} competence The competence object belonging to the competence profile.
   */
  constructor(competence_profile_id, person_id, competence_id, years_of_experience,competence) {
    competence_profile_id&&Validators.isNumber(competence_profile_id, 'competence_profile_id');
    person_id&&Validators.isNumber(person_id, 'person_id');
    competence_id&&Validators.isNumber(competence_id, 'competence_id');
    //years_of_experience&&Validators.isNumber(years_of_experience, 'years_of_experience');
    //competence&&Validators.isObject(competence,'competence');
    this.competence_profile_id = competence_profile_id;
    this.person_id=person_id;
    this.competence_id=competence_id;
    this.years_of_experience=years_of_experience;
    this.competence=competence;
  }
}

module.exports = CompetenceProfileDTO;
