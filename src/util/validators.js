'use strict';

const assert = require('assert').strict;
const validator = require('validator');

class Validators {
  /**
   * Checks if the value is a number (can be either a typeof string or number)
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isNumber(value, varName) {
    assert.equal(true, !isNaN(parseInt(value)) && parseInt(value).toString().length == value.toString().length, `${varName} needs to be a number.`);
  }

  /**
   * Checks if the value is a positive integer
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isPositiveInteger(value, varName) {
    Validators.isNumber(value, varName);
    assert(value > 0, `${varName} needs to be a positive integer.`);
  }

  /**
   * Checks if the input is a valid email
   * @param {email} emailInput The input to check
   * @throws {AssertionError} If validation fails.
   */
  static isEmailValid(emailInput) {
    let emailForm = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    assert(emailForm.test(emailInput));
  }

  /**
   * Checks if the value is a string
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isString(value, varName) {
    assert.equal(typeof value, 'string', `${varName} needs to be a string.`);
  }

  /**
   * Checks if the value is a string of non-zero length
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isStringNonZeroLength(value, varName) {
    Validators.isString(value, varName);
    assert(!validator.isEmpty(value), `${varName} needs to have non-zero length.`);
  }

  /**
   * Checks if the value is an alphabetic string
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isAlphaString(value,varName){
    Validators.isString(value, varName);
    assert(validator.isAlpha(value),`${varName} needs to only contain letters.`);
  }

  /**
   * Checks if the value is an alphanumeric string
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isAlphanumericString(value, varName) {
    Validators.isString(value, varName);
    assert(validator.isAlphanumeric(value), `${varName} needs to only contain letters and numbers.`);
  }

  /**
   * Checks if the value is a number in the specified interval
   * @param {any} value The value to check
   * @param {number} lowerLimit The inclusive lower limit
   * @param {number} upperLimit The inclusive upper limit
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isNumberBetween(value, lowerLimit, upperLimit, varName) {
    Validators.isNumber(value, varName);
    assert(value >= lowerLimit && value <= upperLimit, `${varName} needs to be a number between ${lowerLimit} and ${upperLimit}.`);
  }

  /**
   * Checks that the specified value is a string representing a date.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isStringRepresentingDate(value, varName) {
    Validators.isString(value, varName);
    assert(
        validator.isISO8601(value, {strict: true}),
        `${varName} must be a valid date.`
    );
  }

  /**
   * Checks that the specified value is an object.
   * 
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails. 
   */
  static isObject(value,varName){
    assert(typeof value==='object' && value !==null, `${varName} needs to be an object.`);
  }

  /**
   * Checks if a second date is before a first date.
   * @param  {string} firstDate The first date
   * @param  {string} secondDate The second date
   * @param  {string} varName1 The name of the variable
   * @param  {string} varName2 The name of the variable
   * @throws {AssertionError} If validation fails.
   */
  static dateIsNotPastDate(firstDate, secondDate, varName1, varName2){
    //gets 00:00:00 of current day
    let f = new Date(firstDate);
    let s = new Date(secondDate);
    assert.equal(f.getTime() <= s.getTime() && (firstDate !== null || secondDate !== null), true, "Second date (" + varName2 + ") cannot be before first date (" + varName1 + ")");
  }

}

module.exports = Validators;
