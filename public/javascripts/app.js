/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic', [
    'ngRoute',
    'ngMaterial',
    'jasmic.services',
    'jasmic.controllers'
]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/farmers', {templateUrl: '../partials/farmer_listing.html', controller: 'FarmerListingCtrl'});
        $routeProvider.when('/farmer/:id', {templateUrl: '../partials/farmer_profile_large.html', controller: 'FarmerProfileCtrl'});
        $routeProvider.when('/farmer/:id/edit', {templateUrl: '../partials/farmer_new.html', controller: 'EditFarmerCtrl'});
        $routeProvider.when('/farmer', {templateUrl: '../partials/farmer_new.html', controller: 'NewFarmerCtrl'});
        $routeProvider.when('/search', {templateUrl: '../partials/search.html', controller: 'SearchCtrl'});
        $routeProvider.otherwise({redirectTo: '/search'});
    }]);

angular.module('jasmic.controllers',[]);