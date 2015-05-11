/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic.controllers')
    .controller('FarmerListingCtrl', ['$scope', '$location', '$routeParams', 'FarmersFactory',
        function ($scope, $location, $routeParams, FarmersFactory) {
            $scope.farmers = FarmersFactory.query($routeParams);
            $scope.selected = false;

            $scope.selectedElement = function(farmer) {
                $scope.selectedFarmer = farmer;
                $scope.selected = true;
            };

            $scope.goToFarmer = function() {
                $location.url('farmer/'+$scope.selectedFarmer._id);
            }
        }
    ])
    .controller('FarmerProfileCtrl', ['$scope', '$routeParams', 'FarmerFactory',
        function ($scope, $routeParams, FarmerFactory) {
            $scope.farmer = FarmerFactory.show({id:$routeParams.id});
            $scope.isValid = function(obj) {
                if(obj == undefined) {
                    return false;
                } else if(obj == '') {
                    return false;
                } else {
                    return true;
                }
            };
        }
    ])
    .controller('NewFarmerCtrl', ['$scope', '$routeParams', 'FarmerFactory',
        function ($scope, $routeParams, FarmerFactory) {
            $scope.save = function() {
                //save the farmer!
            };
        }
    ])