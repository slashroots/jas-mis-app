/**
 * Created by matjames007 on 5/6/15.
 */

angular.module('jasmic.controllers')
    .controller('SearchCtrl', ['$scope','$location','$routeParams', 'SearchAllFactory',
        'DemandMatchFactory', 'CommodityMatchFactory', 'SearchInputsFactory',
        function ($scope, $location, $routeParams, SearchAllFactory, DemandMatchFactory,
                  CommodityMatchFactory, SearchInputsFactory) {
            $scope.results = SearchAllFactory.query($routeParams);
            $scope.inputs = SearchInputsFactory.query($routeParams);
            $scope.terms = $routeParams.searchTerms;
            $scope.farmerSelected = false;
            $scope.buyerSelected = false;
            $scope.inputSelected = false

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
                    $scope.buyerSelected = $scope.demandSelected = $scope.commoditySelected =
                        $scope.inputSelected = false;
                } else if(entityType == 'buyer') {
                    $scope.buyerSelected = true;
                    $scope.selectedBuyer = obj;
                    $scope.farmerSelected = $scope.demandSelected = $scope.commoditySelected =
                        $scope.inputSelected = false;
                } else if(entityType == 'demand') {
                    $scope.selectedDemand = obj;
                    $scope.demandSelected = true;
                    $scope.farmerSelected = $scope.buyerSelected = $scope.commoditySelected = false;
                    lookupDemandMatches();
                } else if(entityType == 'commodity') {
                    $scope.demandSelected = $scope.farmerSelected = $scope.buyerSelected =
                        $scope.inputSelected = false;
                    $scope.commoditySelected = true;
                    $scope.selectedCommodity = obj;
                    lookupCommodityMatches();
                } else if(entityType == 'input') {
                    $scope.demandSelected = $scope.farmerSelected = $scope.buyerSelected =
                        $scope.commoditySelected = false;
                    $scope.inputSelected = true;
                    $scope.selectedInput = obj;
                } else {
                    console.log('Mi nuh know weh you click pan boss man');
                }
            };


            $scope.highlightSearchItem = function($event) {

                if ($scope.previousSelectedElement != null) document.getElementById($scope.previousSelectedElement).style.backgroundColor = "transparent";

                var id_no = $event.target.id;

                var selected_element = document.getElementById(id_no).parentElement;//grabs the tr from the td where the event is triggered

                selected_element.style.backgroundColor = "#EEEEEE";

                $scope.previousSelectedElement = selected_element.id;

            };

            $scope.previousSelectedElement = null;


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