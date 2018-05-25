[![Build Status](https://travis-ci.org/sandarsh/BasicRESTAPI.svg?branch=master)](https://travis-ci.org/sandarsh/BasicRESTAPI)
[![codecov](https://codecov.io/gh/sandarsh/BasicRESTAPI/branch/master/graph/badge.svg)](https://codecov.io/gh/sandarsh/BasicRESTAPI)

# BasicRESTAPI

#### Visit https://basicrest.herokuapp.com/api/objects to see the app deployed
#### The app gets deployed to heroku automatically if the build passes.

### Tools Used:
* ExpressJS - Express Server
* NodeJS - Javascript runtime
* Mongodb - Database
* ESLINT - Style guide (extends Airbnb-base configuration)
* dotenv - to easily load environment variables from .env file
* Chai - Assertion Library
* Mocha - Testing framework
* Supertest - library for testing HTTP servers
* Travis-CI - Build
* Codecov - Coverage and test reporting

### Design
This application follows a Service Oriented Architecture. The application resides in the 'app' folder.  
The db folder consists of minimal database operations with the only function of fetching the data from mongodb while making sure:
* The connection is closed and any errors are handled after each request.
* Convert to and from the 'uid' based objects to '_id' based objects recognised by Mongodb.  
The second part was implemented in this layer to rid this responsibility from other services using the db service.

The services folder consists of the router and logger services on the root level and then contains other folders for various services.
* The router.js file indicates where routes to other services can be added.
* The logger service exports the logger object which can be used by other services to generate logs.

The services folder has only one service now called 'BasicRest' which contains the implementation for the assignment.
* This service is only concerned with API level validation, error handling and object translation to the desired structure/format.
* Once the above is done, it makes a call to the 'db' service to fetch the object(s) required, translates into required API response and responds back to the requester. 

### Future Enhancements
This section mentions further enhancement that can be made to improve this service:
* User management
    * Generate API keys for users.
    * Authentication, authorization and session management.

* API enhancement
    * Rate Limiting, throttling, timeouts and other security features.
    * Integrate API management to get statistics on the number of requests made and from which account.
    * Some form of schema definition.
    * More querying options:
        * Implement attribute level fetching - given the 'uid', fetch only specific attributes and not the entire object.
        * Conditional fetching - Fetch all entries '>' or '<' or equal to a given value for an attribute.
        * Bulk Operations - create, replace or delete multiple documents in a single request.

### Build Tool
Travis-CI - Pull requests and pushes to master are automatically built by Travis-ci and deployed on heroku if the build passes.
Visit this link to check the build status - https://travis-ci.org/sandarsh/BasicRESTAPI

### Coverage
Codecov is used to report testing and code coverage. It integrates with Travis seamlessly to provide coverage and test reports for build that have passed on Travis.
To view the coverage report visit - https://codecov.io/gh/sandarsh/BasicRESTAPI

### Running on Local Environment
#### Requirements:
* Local installation of mongodb for development and testing  
* Node.js
#### Instructions
* create a .env file in the root directory (the directory that contains 'server.js')
* Edit the .env file to have the following environment variables:  
    * NODE_ENV=local
    * NODE_HOST=127.0.0.1
    * NODE_PORT=3000   (or the port number you want to run locally on)
    * DB_HOST=127.0.0.1
    * DB_PORT=27017
    * DB_NAME=restbasic (or the name of the database you want to use)
    * DB_COLLECTION=local (or the name of the collection you want to use)
* Run 'npm install' to install all dependencies
* Run 'npm start' to run the app locally
* Run 'npm test' to run tests and view coverage report
  

