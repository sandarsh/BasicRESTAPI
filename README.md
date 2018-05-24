[![Build Status](https://travis-ci.org/sandarsh/BasicRESTAPI.svg?branch=master)](https://travis-ci.org/sandarsh/BasicRESTAPI)
[![Coverage Status](https://coveralls.io/repos/github/sandarsh/BasicRESTAPI/badge.svg?branch=master)](https://coveralls.io/github/sandarsh/BasicRESTAPI?branch=master)

# BasicRESTAPI

#### Visit https://basicrest.herokuapp.com/api/objects to see the app deployed
#### The app gets deployed to heroku automatically if the build passes.

### Build Tool
Travis-CI - Pull requests and pushes to master are automatically built by Travis-ci and deployed on heroku if the build passes.
Visit this link to check the build status - https://travis-ci.org/sandarsh/BasicRESTAPI

### Coverage
Coveralls is used to report testing and code coverage. It integrates with Travis seamlessly to provide covergate and test reports for build that have passed on Travis.
To view the coverage report visit - https://coveralls.io/github/sandarsh/BasicRESTAPI?branch=master

### Running on Local Environment
#### Requirements:
* Local installation of mongodb for development and testing  
* Node.js
#### Instructions
* create a .env file in the root directory
* Edit the .env file to have the following environment variables:  
    * NODE_ENV=local
    * NODE_HOST=127.0.0.1
    * NODE_PORT=3000   (or the port number you want to run locally on)
    * DB_HOST=127.0.0.1
    * DB_PORT=27017
    * DB_NAME=restbasic (or the name of the database you want to use)
    * DB_COLLECTIOM=local (or the name of the collection you want to use)
* Run 'npm install' to install all dependencies
* Run 'npm start' to run the app locally
* Run 'npm test' to run tests and view coverage report
  

