/**
 * Created by matjames007 on 5/6/15.
 */

angular.module('jasmic.controllers')
    .controller('SearchCtrl', ['$scope','$location','$routeParams', '$mdDialog','SearchAllFactory',
        'DemandMatchFactory', 'CommodityMatchFactory', 'SearchInputsFactory', 'UserProfileFactory',
        'CallLogFactory',
        function ($scope, $location, $routeParams, $mdDialog, SearchAllFactory, DemandMatchFactory,
                  CommodityMatchFactory, SearchInputsFactory, UserProfileFactory, CallLogFactory) {
            $scope.results = SearchAllFactory.query($routeParams);
            $scope.inputs = SearchInputsFactory.query($routeParams);
            $scope.terms = $routeParams.searchTerms;
            $scope.farmerSelected = false;
            $scope.buyerSelected = false;
            $scope.inputSelected = false

             /**
           *
           * Gets the currently logged in user.
           *
           **/           
           UserProfileFactory.show(function(user) {
                $scope.user = user;
            });

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
            *
            * Creates a call and associates call with the farmer
            * and logged in user. 
            * TODO - Create form to accept call type details and 
            * pass data from $scope variable. To test function
            * change ct_call_type_name.
            **/            
            $scope.createCall = function(){    
                 var call_type_obj = {
                     ct_call_type_name: "Search",
                     ct_call_type_desc: "Foo",
                     us_user_id: $scope.user._id
                 };
                 CallLogFactory.create({ cc_caller_id: $scope.selectedFarmer.fa_contact,
                                         cc_entity_id : $scope.selectedFarmer._id,
                                         cc_entity_type: "farmer",
                                         us_user_id : $scope.user._id,
                                         call_type: call_type_obj }, 
                    function(success){
                         showDialog($mdDialog, {statusText:"New Call Addded!"}, false);
                    }, function(fail){
                        showDialog($mdDialog, error, true);
                    });
            }
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

/**
 * A general purpose Dialog window to display feedback from the
 * server.
 *
 * @param $mdDialog
 * @param ev
 * @param message
 * @param isError
 */
function showDialog($mdDialog, message, isError) {
    $mdDialog.show(
        $mdDialog.alert()
            .parent(angular.element(document.body))
            .title(isError? 'Error Detected':'System Message')
            .content(message.statusText)
            .ariaLabel(isError?'Alert Error':'Alert Message')
            .ok('Ok')
    );
};