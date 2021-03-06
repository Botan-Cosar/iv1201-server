'use strict';

const Validators = require('../util/validators');

/**
 * A person from the database.
 */
class PersonDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} person_id The id of the person.
   * @param {string} name The name of the person.
   * @param {string} surname The surname of the person.
   * @param {string} ssn The ssn of the person.
   * @param {string} email The email of the person.
   * @param {string} password The password of the person.
   * @param {number} role_id The role id of the person
   * @param {string} username The username of the person.
   * @param {Array} competence_profiles The competence profiles belonging to the person.
   */
  constructor(person_id, name, surname, ssn, email, password, role_id, username,competence_profiles) {
    person_id&&Validators.isPositiveInteger(person_id, 'person_id');
    name&&Validators.isStringNonZeroLength(name, 'name');
    name&&Validators.isAlphanumericString(name, 'name');
    surname&&Validators.isStringNonZeroLength(surname, 'surname');
    surname&&Validators.isAlphanumericString(surname, 'surname');
    ssn&&Validators.isStringNonZeroLength(ssn, 'ssn');
    email&&Validators.isEmailValid(email);
    password&&Validators.isStringNonZeroLength(password, 'password');
    role_id&&Validators.isPositiveInteger(role_id, 'role_id');
    username&&Validators.isStringNonZeroLength(username, 'username');
    username&&Validators.isAlphanumericString(username, 'username');
    competence_profiles&&Validators.isArray(competence_profiles,'competence_profiles');
    this.person_id = person_id;
    this.name=name;
    this.surname=surname;
    this.ssn=ssn;
    this.email=email;
    this.password=password;
    this.role_id=role_id;
    this.username = username;
    this.competence_profiles=competence_profiles
  }
}

module.exports = PersonDTO;
