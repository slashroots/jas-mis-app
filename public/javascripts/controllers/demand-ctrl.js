/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DemandListingCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory) {
            CurrentDemandsFactory.query({}, function(demands) {
                $scope.demands = demands;
            },
            function(error) {
                $scope.demands = [];
            });
        }
    ]);