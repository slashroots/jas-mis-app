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
            $scope.inputSelected = false;
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
             *
             **/
            $scope.createCall = function(){
                if($scope.farmerSelected){

                    $scope.farmer = $scope.selectedFarmer;
                    $scope.cc_caller_id = $scope.selectedFarmer.fa_contact;
                    $scope.cc_entity_id = $scope.selectedFarmer._id;
                    $scope.cc_entity_type = "farmer";
                    $scope.cc_entity_name = $scope.selectedFarmer.fa_first_name + " " + $scope.selectedFarmer.fa_last_name;
                }
                if($scope.buyerSelected){
                    $scope.buyer = $scope.selectedBuyer;
                    $scope.cc_caller_id = $scope.selectedBuyer.bu_phone;
                    $scope.cc_entity_id = $scope.selectedBuyer._id;
                    $scope.cc_entity_type = "buyer";
                    $scope.cc_entity_name = $scope.selectedBuyer.bu_buyer_name;
                }
                showCallInputDialog($mdDialog, $scope);
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
/**
 * Dialog to accept call notes, select call type
 * and save a call.
 *
 * @param $mdDialog
 * @param $scope
 * @param selectedFarmer
 */
function showCallInputDialog($mdDialog, $scope){
    $mdDialog.show({
        scope: $scope,
        clickOutsideToClose: true,
        preserveScope: true,
        templateUrl: '/partials/call_input_form.html',
        parent: angular.element(document.body),
        /**
         * This controller is responsible for all actions
         * done on the Call Input Dialog.
         * @param $scope
         * @param $mdDialog
         * @param CallTypesFactory
         * @param CallLogFactory
         */
        controller: function SearchDialogController($scope, $route, $mdDialog, CallTypesFactory, CallLogFactory){
            CallTypesFactory.show(function(calltypes){
                $scope.calltypes = calltypes;
            }, function(error){
                showDialog($mdDialog, error, true);
            });
            /*
             *  Gets the selected call type from
             *  drop down menu.
             */
            $scope.selectedCallType = function(call_type){
                $scope.selectedCallType = call_type;
            };
            /*
             *  Dismisses the dialog box.
             */
            $scope.cancel = function(){
                $mdDialog.hide();
            };
            /**
             * Creates a call and associates call with the farmer
             * and logged in user.
             **/
            $scope.saveCall = function(){
            //  console.log($scope.user)
                var call = {
                    cc_caller_id: $scope.cc_caller_id,
                    cc_entity_id : $scope.cc_entity_id,
                    cc_entity_type: $scope.cc_entity_type,
                    cc_entity_name: $scope.cc_entity_name,
                    us_user_id : $scope.user._id,
                    cc_date: Date.now(),
                    ct_call_type: $scope.selectedCallType._id,
                    cc_note: $scope.call.cc_note };
                if($scope.farmer) {
                    call.cc_entity_name = $scope.farmer.fa_first_name + " " + $scope.farmer.fa_last_name;
                } else if($scope.buyer) {
                    call.cc_entity_name = $scope.buyer.bu_buyer_name;
                }
                CallLogFactory.create(call,
                    function(success){
                        $mdDialog.hide();
                        showDialog($mdDialog, {statusText:"New Call Added!"}, false);
                        $route.reload();
                    }, function(fail){
                        $mdDialog.hide();
                        showDialog($mdDialog, error, true);
                    });
            }//end of saveCall function
        }//end of controller
    });
};
