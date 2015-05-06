/**
 * Created by matjames007 on 5/6/15.
 */

angular.module('jasmic.controllers')
    .controller('SearchCtrl', ['$scope', '$routeParams', 'FarmersFactory',
        function ($scope, $routeParams, FarmersFactory) {
            $scope.farmers = FarmersFactory.query($routeParams);
        }
    ]);