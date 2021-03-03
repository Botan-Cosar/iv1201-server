'use strict';

class Logger {
  /**
   * Logs the received message
   * @param  {[type]} msg The message to log
   */
  static logMessage(msg) {
    console.log("\t[LOG] " + msg);
  }

  /**
   * Logs the received error
   * @param  {[type]} err The error to log
   */
  static logError(err) {
    console.error(err);
  }
}


module.exports = Logger;
