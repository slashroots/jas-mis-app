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

            UserProfileFactory.show(function(user) {
                $scope.loggedUser = user;
            }, function(fail) {
                console.log(fail);
            });

            $scope.goTo = function(l) {
                $location.url('/' + l);
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
            };

            /**
             * If the user is of type "Administrator"
             * then return true;
             */
            $scope.isAdmin = function() {
                return ($scope.loggedUser.ut_user_type == "Administrator");
            };
        }]);