/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DemandListingCtrl', ['$scope','$location','$routeParams', 'DemandsFactory',
        function ($scope, $location, $routeParams, DemandsFactory) {
            DemandsFactory.query({}, function(buyers) {
                $scope.buyers = buyers;
            },
            function(error) {
                $scope.buyers = [];
            });
        }
    ]);