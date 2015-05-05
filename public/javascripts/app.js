/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic', [
    'ngRoute',
    'ngMaterial',
    'jasmic.services',
    'jasmic.controllers'
]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/farmer', {templateUrl: '../partials/farmer_listing.html', controller: 'FarmerListingCtrl'});
        $routeProvider.otherwise({redirectTo: '/farmer'});
    }]);

angular.module('jasmic.controllers',[]);