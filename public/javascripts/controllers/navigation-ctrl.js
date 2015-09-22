/**
 * Created by matjames007 on 4/30/15.
 */
angular.module('jasmic.controllers')
/**
 * navigationCtrl is intended to provide quick page changes and should appear on
 * all screens.
 */
    .controller('NavigationCtrl', ['$scope', '$location','$mdDialog', 'UserProfileFactory', 'UserSessionDestroyFactory',
        function ($scope, $location, $mdDialog, UserProfileFactory, UserSessionDestroyFactory) {
            $scope.add_clicked = false;

            /**
             * Used to display the user currently active in the
             * session.
             */
            UserProfileFactory.show(function(user) {
                $scope.loggedUser = user;
                if($scope.loggedUser.ut_user_type === "Administrator")
                    $scope.isAdmin = true;

            }, function(fail) {
                $scope.goTo('login');
            });
            /**
             * Go to another section of the angular application
             * @param l
             */
            $scope.goTo = function(l) {
                $location.url('/' + l);
            };
            $scope.addNewButtonClick = function() {
                $scope.add_clicked=!$scope.add_clicked;
            };

            $scope.logout = function() {
                UserSessionDestroyFactory.killSession(function(res) {
                    window.location = "/login";
                });
            };
            /**
             * Create a new call for an entity other than a farmer
             * or buyer.
             */
            $scope.createCall = function(){
                showNewCallInputDialog($mdDialog, $scope);
            };
            /**
             * Create an input for an existing supplier
             */
            $scope.createInput = function(){
                showNewInputDialog($mdDialog,$scope);
            };
            /**
             * Shows the administrative functions for an admin user
             */
            $scope.showAdmin = function(){
              if($scope.loggedUser.ut_user_type === "Administrator"){
                  $scope.goTo('admin');
              }
            };
        }]);

/**
 * Dialog to accept call notes, select call type
 * and save a call.
 *
 * @param $mdDialog
 * @param $scope
 * @param selectedFarmer
 */
function showNewCallInputDialog($mdDialog, $scope){
    $mdDialog.show({
        scope: $scope,
        clickOutsideToClose: true,
        preserveScope: true,
        templateUrl: '/partials/call_input_form_new.html',
        /**
         * This controller is responsible for all actions
         * done on the Call Input Dialog.
         * @param $scope
         * @param $mdDialog
         * @param CallTypesFactory
         * @param CallLogFactory
         */
        controller: function NewCallDialogController($scope, $mdDialog, CallTypesFactory, CallLogFactory){
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
                clearCallFormData();
            };

            /**
             * Use to clear form data from Call Form.
             */
            clearCallFormData = function() {
                $scope.cc_caller_id = "";
                $scope.cc_entity_name = "";
                $scope.cc_note = "";
            };
            /**
             * Creates a call and associates call with the farmer
             * and logged in user.
             **/
            $scope.saveCall = function(){
                CallLogFactory.create({
                        cc_caller_id: $scope.cc_caller_id,
                        cc_entity_type: "other",
                        cc_entity_name: $scope.cc_entity_name,
                        us_user_id : $scope.loggedUser._id,
                        ct_call_type: $scope.selectedCallType._id,
                        cc_note: $scope.cc_note,
                        cc_date: Date.now()
                    },
                    function(success){
                        $mdDialog.hide();
                        showDialog($mdDialog, {statusText:"New Call Added!"}, false);
                        clearCallFormData();
                        loadCalls();
                    }, function(fail){
                        $mdDialog.hide();
                        showDialog($mdDialog, error, true);
                    });
            }//end of saveCall function
        }//end of controller
    });
};

/**
 * Dialog to accept call notes, select call type
 * and save a call.
 *
 * @param $mdDialog
 * @param $scope
 */
function showNewInputDialog($mdDialog, $scope){
    $mdDialog.show({
        scope: $scope,
        clickOutsideToClose: true,
        preserveScope: true,
        templateUrl: '/partials/input_new_dialog.html',
        /**
         * This controller is responsible for all actions
         * done on the Call Input Dialog.
         * @param $scope
         * @param $mdDialog
         * @param SuppliersFactory
         * @param UnitsFactory
         * @param InputsFactory
         *
         */
        controller: function InputController($scope, $mdDialog, SuppliersFactory, UnitsFactory, InputTypesFactory,SupplierInputFactory){
            $scope.discounts = ['Yes', 'No'];
            SuppliersFactory.query(function(suppliers){
                $scope.suppliers = suppliers;
            });
            UnitsFactory.query({},function(units){
                $scope.units = units;
            });
            InputTypesFactory.query(function(input_types){
                $scope.input_types = input_types;
            });
            /**
             *  Dismisses the dialog box.
             */
            $scope.cancel = function(){
                $mdDialog.hide();
                $scope.input = {};
            };
            /**
             * Saves a new input for a supplier.
             **/
            $scope.save = function(){
                SupplierInputFactory.create({id:$scope.input.su_supplier},$scope.input, function(success){
                    $mdDialog.hide();
                    showDialog($mdDialog, {statusText:"New Input Added!"}, false);
                }, function(error){
                    $mdDialog.hide();
                    showDialog($mdDialog, error, false);
                });
                $scope.input = {};
            };
        }//end of controller
    });
};
