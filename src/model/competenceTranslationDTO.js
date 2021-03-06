'use strict';

const Validators = require('../util/validators');

/**
 * A competence translation from the database.
 */
class CompetenceTranslationDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} translation_id The id of the translation.
   * @param {number} competence_id The competence_id of the translation.
   * @param {string} language The language of the translation.
   * @param {string} translation The translated text.
   */
  constructor(translation_id, competence_id, language, translation) {
    translation_id&&Validators.isPositiveInteger(translation_id, 'translation_id');
    competence_id&&Validators.isPositiveInteger(competence_id, 'competence_id');
    language&&Validators.isStringNonZeroLength(language, 'language');
    language&&Validators.isAlphanumericString(language, 'language');
    translation&&Validators.isStringNonZeroLength(translation, 'translation');
    this.translation_id = translation_id;
    this.competence_id=competence_id;
    this.language=language;
    this.translation=translation;
  }
}

module.exports = CompetenceTranslationDTO;
