/**
 * Created by matjames007 on 4/30/15.
 */
angular.module('jasmic.controllers')
/**
 * navigationCtrl is intended to provide quick page changes and should appear on
 * all screens.
 */
    .controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.goTo = function() {
            if($scope.nav == 'Search') {
                $location.url('/search');
            } else if($scope.nav == 'Supply Data') {
                $location.url('/supplies');
            } else if($scope.nav == 'Price Data') {
                $location.url('/prices');
            } else {
                $location.url('/dashboard');
            }
            console.log($scope.nav);
        }
    }]);