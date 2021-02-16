'use strict';

const PersonApi = require('./personAPI');
const LoginApi = require('./loginAPI');
const ForgotPasswordApi = require('./forgotPasswordAPI');
//const SetPasswordApi = require('./SetPasswordAPI');
const ApplicationApi = require('./applicationAPI');

/**
 * Contains all request handlers.
 */
class RequestHandlerLoader {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.reqHandlers = [];
  }

  /**
   * Adds a new request handler.
   *
   * @param {RequestHandler} reqHandler The request handler that will be added.
   */
  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  /**
   * Makes all request handlers available in the specified express
   * Application object.
   *
   * @param {Application} app The express application hosting the request handlers.
   */
  loadHandlers(app) {
    this.reqHandlers.forEach((reqHandler) => {
      reqHandler.registerHandler();
      app.use(reqHandler.path, reqHandler.router);
    });
  }
}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new PersonApi());
loader.addRequestHandler(new LoginApi());
loader.addRequestHandler(new ForgotPasswordApi());
//loader.addRequestHandler(new SetPasswordApi());
loader.addRequestHandler(new ApplicationApi());

module.exports = loader;
