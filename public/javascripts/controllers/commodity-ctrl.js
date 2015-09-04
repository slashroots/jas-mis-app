/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('CommodityListingCtrl', ['$scope','$location','$routeParams', 'CurrentCommoditiesFactory',
        'CommodityMatchFactory',
        function ($scope, $location, $routeParams, CurrentCommoditiesFactory, CommodityMatchFactory) {
            /**
             * This queries the database for the current active commodities
             */
            CurrentCommoditiesFactory.query({}, function(commodities) {
                $scope.commodities = commodities;
            },
            function(error) {
                $scope.commodities = [];
            });

            /**
             * trigger a click action to retrieve the item from the table
             * for the lookup.
             * @param commodity
             */
            $scope.selectedItem = function(commodity) {
                $scope.selectedCommodity = commodity;
                $scope.itemSelected = true;
                lookupCommodityMatches();
            };

            /**
             * The front end uses this to adjust the the screen to accomodate the floating card
             * @type {boolean}
             */
            $scope.itemSelected = false;

            lookupCommodityMatches = function() {
                CommodityMatchFactory.query({id: $scope.selectedCommodity._id}, function(list) {
                    $scope.m_demands = list;
                })
            }
        }
    ]);
