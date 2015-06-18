/**
 * Created by matjames007 on 4/30/15.
 */
angular.module('jasmic.controllers')
/**
 * navigationCtrl is intended to provide quick page changes and should appear on
 * all screens.
 */
    .controller('NavigationCtrl', ['$scope', '$location', 'UserProfileFactory',
        function ($scope, $location, UserProfileFactory) {
            $scope.add_clicked = false;

            $scope.loggedUser = UserProfileFactory.show();

            $scope.goTo = function() {

                if($scope.nav == 'Search') {
                    $location.url('/search');
                } else if($scope.nav == 'Supply Data') {
                    $location.url('/supplies');
                } else if($scope.nav == 'Demand Data') {
                    $location.url('/demands');
                } else {
                    $location.url('/dashboard');
                }
            };
            $scope.addNewButtonClick = function() {
                $scope.add_clicked=!$scope.add_clicked;
            };

            $scope.addNew = function(entity) {
                if(entity == 'farmer') {
                    $location.url('/farmer');
                } else if(entity == 'buyer') {
                    $location.url('/buyer');
                } else if(entity == 'call'){
                    $location.url('/call');
                } else if(entity == 'transaction') {
                    $location.url('/transaction');
                } else if(entity == 'supplier') {
                    $location.url('/supplier');
                } else {
                    console.log('Unknown route!');
                }
            }
        }]);//end of controller