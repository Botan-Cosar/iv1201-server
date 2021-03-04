'use strict';

const Validators = require('../util/validators');

/**
 * A competence from the database.
 */
class CompetenceDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} competence_id The id of the competence.
   * @param {Array} competence_translations The translations belonging to this competence.
   */
  constructor(competence_id,competence_translations) {
    competence_id&&Validators.isNumber(competence_id, 'competence_id');
    //competence_translations&&Validators.isArray(competence_translations,'competence_translations');
    this.competence_id = competence_id;
    this.competence_translations=competence_translations;
  }
}

module.exports = CompetenceDTO;
