'use strict';

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
   */
  constructor(person_id, name, surname, ssn, email, password, role_id, username) {
    this.person_id = person_id;
    this.name=name;
    this.surname=surname;
    this.ssn=ssn;
    this.email=email;
    this.password=password;
    this.role_id=role_id;
    this.username = username;
  }
}

module.exports = PersonDTO;
