/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic.controllers')
    .controller('FarmerListingCtrl', ['$scope', 'FarmersFactory', function ($scope, FarmersFactory) {
        $scope.farmers = FarmersFactory.query();
    }]);