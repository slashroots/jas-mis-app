/**
 * Created by matjames007 on 4/29/15.
 */
// TODO: THIS IS JUST A STUB!
angular.module('jasmic', [
    'ngRoute',
    'jasmic.services',
    'jasmic.directives',
    'jasmic.controllers'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/farmer', {templateUrl: 'partials/farmer.html', controller: 'MyCtrl1'});
    }]);
