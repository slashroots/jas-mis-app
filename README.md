#Jamaica Agriculture Society - Marketing Information System
[![Build Status](https://travis-ci.org/slashroots/jas-mis-app.svg?branch=master)](https://travis-ci.org/slashroots/jas-mis-app) [![Build Status](https://travis-ci.org/slashroots/jas-mis-app.svg?branch=develop)](https://travis-ci.org/slashroots/jas-mis-app) [![Coverage Status](https://coveralls.io/repos/slashroots/jas-mis-app/badge.svg)](https://coveralls.io/r/slashroots/jas-mis-app)

![image](http://slashroots.org/img/logo.png)

This application is built using the MEAN application stack. Mongo for persisting information, express framework for quick web application development, angular for front end and excellent data binding and Node.js the key ingredient to render, transform and communicate information to the users.  

In this project we will be using Material design elements to give users the best possible experience on our platform.  

Cheers!

![Mean.js](http://meanjs.org/img/logo.png)

## Environment Config Variables

It is necessary to setup the database URI for the application.  To do this run the following:
```
export MONGOLAB_URI="mongodb://username:password@hostname:port/database_name"
```
Also in order to initialize session, ensure that you have an environment variable called ```SESSION_SECRET``` for the application.  So run the following:
```
export SESSION_SECRET="384732874EF232934898A01E"
```
In order to initially setup the system.  You must have a ```DEFAULT_USER="admin"``` and a ```DEFAULT_PASS="21232f297a57a5a743894a0e4a801fc3"``` or username: admin and password: admin.
Create a new administrator and remove ```DEFAULT_USER and DEFAULT_PASS``` from the command line!

The system uses SendGrid to send emails. Like the above, run the following commands to ensure the application will be able to send
emails:
```
export SENDGRID_USERNAME=<username>
```
```
export SENDGRID_PASSWORD=<password>
```

## Importing Data

1.	Create all parishes with parish code and parish names ```[POST /common/parishes]```
2.  Import District and Extensions with matching parish names ```[POST /common/districts]```
3.  Import Branches and their Parish Code with ```[POST /branches]```
2.	Create all membership Types with distinct values (direct/branch etc) ```[POST /membershipType]```
3.	Create JSON array that matches the fields in the function ```performTransform()``` in the ```farmer.js``` file.
4.  Load JSON array in request body and send the request to the ```[POST /farmers]```.
5.  Insert crop names and varieties ```[POST /crops]```
6.  Insert units
7.  Insert buyer types
8.  Sit back and watch the magic!

## Assumptions During import (direct membership)

1.  The ```Mailing address``` is the farmer's residency address.  If this isn't given, the ```farmers address``` by default is both the address of the farm and the farmer's residency address.
2.  The number in the ```acreage``` field is the acreage for the farm with address given by ```farmers address```.
3.  The year range given by ```2006-2007``` means that the membership period is 1st of April ```2006``` to the 31st of March ```2007```.
4.  The symbol ```√``` and the ```A``` in the year range columns have the same meaning (active registration for the period).
5.  Direct members have always paid $1000 for dues.
6.  Branch members have always paid $200 for dues.
7.  Every member designated as being active for a period has paid his dues
8.  The parish code represents the parish for which the farmer is a member but NOT necessarily where he/she resides.


Cheers!