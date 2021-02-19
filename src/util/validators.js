import { strict as assert } from 'assert';


class Validators {
  /**
   * Checks if the value is a number
   *
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isNumber(value, varName) {
    assert.equal(typeof value, 'number', `${varName} needs to be a number.`);
  }

  /**
   * Checks if the value is an integer
   *
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isInteger(value, varName) {
    Validators.isNumber(value, varName);
    assert(!Number.isNaN(value) && Number.isInteger(value), `${varName} needs to be an integer.`);
  }

  /**
   * Checks if the value is a positive integer
   *
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isPositiveInteger(value, varName) {
    Validators.isInteger(value, varName);
    assert(value > 0, `${varName} needs to be a positive integer.`);
  }


}

module.exports = Validators;
