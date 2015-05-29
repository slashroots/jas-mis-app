/**
 * Created by matjames007 on 5/6/15.
 */

angular.module('jasmic.controllers')
    .controller('SearchCtrl', ['$scope','$location','$routeParams', 'SearchAllFactory', 'DemandMatchFactory',
        'CommodityMatchFactory',
        function ($scope, $location, $routeParams, SearchAllFactory, DemandMatchFactory, CommodityMatchFactory) {
            $scope.results = SearchAllFactory.query($routeParams);
            $scope.terms = $routeParams.searchTerms;
            $scope.farmerSelected = false;
            $scope.buyerSelected = false;

            $scope.searchAll = function() {
                $location.url("/search?searchTerms=" + $scope.search);
            };

            $scope.goToFarmer = function() {
                $location.url('farmer/'+$scope.selectedFarmer._id);
            };

            $scope.goToDemand = function() {
                $location.url('demand/' + $scope.selectedDemand._id);
            };

            $scope.editFarmer = function() {
                $location.url('farmer/'+$scope.selectedFarmer._id+'/edit');
            };

            $scope.goToBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id);
            };

            $scope.editBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id+'/edit');
            };


            /**
             * TODO: This is a such a BAD function. Need to revisit.
             * @param entityType
             * @param obj
             */
            $scope.selectedElement = function(entityType, obj) {
                if(entityType == 'farmer') {
                    $scope.selectedFarmer = obj;
                    $scope.farmerSelected = true;
                    $scope.buyerSelected = false;
                    $scope.demandSelected = false;
                    $scope.commoditySelected = false;
                } else if(entityType == 'buyer') {
                    $scope.farmerSelected = false;
                    $scope.buyerSelected = true;
                    $scope.selectedBuyer = obj;
                    $scope.demandSelected = false;
                    $scope.commoditySelected = false;
                } else if(entityType == 'demand') {
                    $scope.selectedDemand = obj;
                    $scope.demandSelected = true;
                    $scope.farmerSelected = false;
                    $scope.buyerSelected = false;
                    $scope.commoditySelected = false;
                    lookupDemandMatches();
                } else if(entityType == 'commodity') {
                    $scope.demandSelected = false;
                    $scope.farmerSelected = false;
                    $scope.buyerSelected = false;
                    $scope.commoditySelected = true;
                    $scope.selectedCommodity = obj;
                    lookupCommodityMatches();
                } else {
                    console.log('Mi nuh know weh you click pan boss man');
                }
            };

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.selectedDemand._id}, function(list) {
                    $scope.m_commodities = list;
                });
            };
            lookupCommodityMatches = function() {
                CommodityMatchFactory.query({id: $scope.selectedCommodity._id}, function(list) {
                    $scope.m_demands = list;
                });
            };


        }
    ]);