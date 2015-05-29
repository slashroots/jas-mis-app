/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DemandListingCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        'DemandMatchFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory, DemandMatchFactory) {
            CurrentDemandsFactory.query({}, function(demands) {
                $scope.demands = demands;
            },
            function(error) {
                $scope.demands = [];
            });

            $scope.selectedItem = function(demand) {
                $scope.selectedDemand = demand;
                $scope.itemSelected = true;
                lookupDemandMatches();
            };

            $scope.itemSelected = false;

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.selectedDemand._id}, function(list) {
                    $scope.m_commodities = list;
                })
            }
        }
    ])
    .controller('DemandProfileCtrl', ['$scope','$location','$routeParams', 'DemandFactory',
        'DemandMatchFactory',
        function ($scope, $location, $routeParams, DemandFactory, DemandMatchFactory) {
            DemandFactory.show({id:$routeParams.id}, function(demand) {
                    $scope.demand = demand;
                    $scope.selectedDemand = demand;
                    lookupDemandMatches();
                },
                function(error) {
                    $scope.demand = {};
                });

            $scope.checked = function(commodity) {
                console.log(this.m_commodities);
            };

            $scope.allSelected = false;
            $scope.m_commodities = [];

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.demand._id}, function(list) {
                    $scope.commodities = list;
                })
            }
        }
    ]);