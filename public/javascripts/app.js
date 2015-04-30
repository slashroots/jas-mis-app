/**
 * Created by matjames007 on 4/29/15.
 */
// TODO: THIS IS JUST A STUB!
'use strict';

angular.module('jasmic', [
    'ngRoute',
    'ngMaterial',
    'jasmic.services',
    'jasmic.controllers'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/farmer', {templateUrl: 'partials/farmer.html', controller: 'MyCtrl1'});
    }]);
