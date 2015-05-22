/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('CommodityListingCtrl', ['$scope','$location','$routeParams', 'CurrentCommoditiesFactory',
        'CommodityMatchFactory',
        function ($scope, $location, $routeParams, CurrentCommoditiesFactory, CommodityMatchFactory) {
            CurrentCommoditiesFactory.query({}, function(commodities) {
                $scope.commodities = commodities;
            },
            function(error) {
                $scope.commodities = [];
            });

            $scope.selectedItem = function(commodity) {
                $scope.selectedCommodity = commodity;
                $scope.itemSelected = true;
                lookupCommodityMatches();
            };

            $scope.itemSelected = false;

            lookupCommodityMatches = function() {
                CommodityMatchFactory.query({id: $scope.selectedCommodity._id}, function(list) {
                    $scope.m_demands = list;
                })
            }
        }
    ]);