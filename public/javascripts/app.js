/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic', [
    'ngRoute',
    'ngMaterial',
    'jasmic.services',
    'jasmic.controllers',
    'selectionModel'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/farmers', {templateUrl: '../partials/farmer_listing.html', controller: 'FarmerListingCtrl'});
    $routeProvider.when('/buyers', {templateUrl: '../partials/buyer_listing.html', controller: 'BuyersListingCtrl'});
    $routeProvider.when('/farmer/:id', {templateUrl: '../partials/farmer_profile_large.html', controller: 'FarmerProfileCtrl'});
    $routeProvider.when('/buyer/:id', {templateUrl: '../partials/buyer_profile_large.html', controller: 'BuyerProfileCtrl'});
    $routeProvider.when('/supplier/:id', {templateUrl: '../partials/supplier_profile_large.html', controller: 'SupplierProfileCtrl'});
    $routeProvider.when('/demand/:id', {templateUrl: '../partials/demand_profile_large.html', controller: 'DemandProfileCtrl'});
    $routeProvider.when('/farmer/:id/edit', {templateUrl: '../partials/farmer_new.html', controller: 'EditFarmerCtrl'});
    $routeProvider.when('/buyer/:id/edit', {templateUrl: '../partials/buyer_new.html', controller: 'EditBuyerCtrl'});
    $routeProvider.when('/farmer', {templateUrl: '../partials/farmer_new.html', controller: 'NewFarmerCtrl'});
    $routeProvider.when('/buyer', {templateUrl: '../partials/buyer_new.html', controller: 'NewBuyerCtrl'});
    $routeProvider.when('/supplier', {templateUrl: '../partials/supplier_new.html', controller: 'NewSupplierCtrl'});
    $routeProvider.when('/search', {templateUrl: '../partials/search.html', controller: 'SearchCtrl'});
    $routeProvider.when('/demands', {templateUrl: '../partials/demand_listing.html', controller: 'DemandListingCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'DashboardCtrl'});
    $routeProvider.when('/calls', {templateUrl: '../partials/call_report_listing_large.html', controller: 'DashboardCtrl'});
    $routeProvider.when('/supplies', {templateUrl: '../partials/commodity_listing.html', controller: 'CommodityListingCtrl'});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
}]).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('HTTPInterceptor');
}]);

angular.module('jasmic.controllers',[]);
