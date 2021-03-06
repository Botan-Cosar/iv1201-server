'use strict';

const Validators = require('../util/validators');

/**
 * An application from the database.
 */
class ApplicationDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} availability_id The id of the availability.
   * @param {string} from_date The starting point for the availability.
   * @param {string} to_date The end point for the availability.
   * @param {string} createdAt The application date.
   * @param {string} application_status The status of the application.
   * @param {number} version_number The version number of the application.
   * @param {object} person The person the application belongs to.
   */
  constructor(availability_id, from_date, to_date, createdAt, application_status, version_number, person) {
    availability_id&&Validators.isPositiveInteger(availability_id, 'availability_id');
    from_date&&Validators.isStringRepresentingDate(from_date,'from_date');
    to_date&&Validators.isStringRepresentingDate(to_date,'to_date');
    from_date&&to_date&&Validators.dateIsNotPastDate(from_date,to_date,"from_date","to_date");
    application_status&&Validators.applicationStatusIsValid(application_status,'application_status');
    version_number&&Validators.isNumber(version_number, 'version_number');
    person&&Validators.isObject(person,'person');

    this.availability_id = availability_id;
    this.from_date=from_date;
    this.to_date=to_date;
    this.createdAt=createdAt;
    this.application_status=application_status;
    this.version_number=version_number;
    this.person=person;
  }
}

module.exports = ApplicationDTO;
