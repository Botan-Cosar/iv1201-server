# IV1201-REST

This project is is a part of the course Design of Global Applications (IV1201) on KTH. The project is a recruiting application for an amusement park where applicants can make applications to work and recruiters can either accept or decline those applications. To fulfill these requirements the project is split into three parts, client side, server side and database. This is the repository for the client side of the project and will only discuss what that entails. More info about the server and database side can be found here: [other repository](https://github.com/Botan-Cosar/iv1201-server).

## REST

This server side of the project uses sequelize to accomplish a REST api architecture. The client side (react application) communicates with this REST server, which in turn sends requests to the database. Both the REST server and the database are hosted in the same [project on heroku](https://dashboard.heroku.com/apps/iv1201-rest-server).

## Local development

In the project directory, you can run:

### `nodemon server`

If nodemon is installed (if not, run "npm install nodemon") the mentioned command will host the REST server locally. Whenever a change is made to a file the rest server will update and reflect the new changes, making it a lot easier to develop the code.
The REST api will by default open on port 5000 (http://localhost:5000). Note: Make sure to re-route the react client to this address if you want to test things locally from react.

## Postman

A very handy tool to quickly and effectively test the API is to use something like [Postman](https://www.postman.com/) to create requests and see responses. 
Since most parts of the REST api is behind an authorization wall you have to set the authorization header to gain access. To do this first log into the website normally, then under local-storage you will find a Key-Value pair with the keyname "authToken" with the corresponding key for your session.
Now under the "Headers" tab in postman make a key called "Authorization" with a value of "Bearer [KEY]" (without the brackets). Make sure "Bearer" is spelled correctly and that there is a space in between "Bearer" and the key.

## Code Style and Architecture

The REST server is divided into a few layers which are: api, controller, integration, model and util, all of which can be found under the /src/ directory. 
The api layer contains the functionality for handeling logic and requests from the client.
The controller is used to keep the architecture consistent and easier to develop by keeping things like coupling and dependencies low.
The integration layer contains the dao which is the last thing before the database call. Its from here all the communication to the database occurs.
Lastly the model contains definitions for models in the database, as well as DTOs used in the REST server.
The util folder contains validation and tests.

Classes use PascalCase. All other names like: Folders, Filenames, Functions and Variables use camelCase. 

## GitHub Actions

This repository is set up with heroku's CI/CD pipeline that deploys to [this](https://dashboard.heroku.com/apps/iv1201-rest-server) heroku project.

