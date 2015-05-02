#Jamaica Agriculture Society - Marketing Information System
[![Build Status](https://travis-ci.org/slashroots/jas-mis-app.svg?branch=master)](https://travis-ci.org/slashroots/jas-mis-app) [![Build Status](https://travis-ci.org/slashroots/jas-mis-app.svg?branch=develop)](https://travis-ci.org/slashroots/jas-mis-app) [![Coverage Status](https://coveralls.io/repos/slashroots/jas-mis-app/badge.svg)](https://coveralls.io/r/slashroots/jas-mis-app)

![image](http://slashroots.org/img/logo.png)

This application is built using the MEAN application stack. Mongo for persisting information, express framework for quick web application development, angular for front end and excellent data binding and Node.js the key ingredient to render, transform and communicate information to the users.  

In this project we will be using Material design elements to give users the best possible experience on our platform.  

Cheers!

![Mean.js](http://meanjs.org/img/logo.png)

## Importing Data

1.	Create all parishes with parish code and parish names
2.	Create all membership Types with distinct values (direct/branch etc)
3.	Create JSON array that matches the fields in the function ```performTransform()``` in the ```farmer.js``` file.
4.  Load JSON array in request body and send the request to the ```/farmers``` endpoint using ```POST``` action.
5.  Sit back and watch the magic!

Cheers!