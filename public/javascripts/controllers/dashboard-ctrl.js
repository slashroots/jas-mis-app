/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory) {
            CurrentDemandsFactory.show({amount:5}, function(demands) {
                    $scope.demands = demands;
                },
                function(error) {
                    $scope.demands = [];
                });
        }
    ]);