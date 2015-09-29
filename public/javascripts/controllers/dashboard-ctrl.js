/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', '$mdDialog','CurrentDemandsFactory',
        'OpenTransactionsFactory', 'TransactionsFactory','CallLogsFactory', 'UserProfileFactory',
        'CallTypesFactory',  'ParishesFactory', 'SuppliersFactory', 'InputsFactory',
        function ($scope, $location, $routeParams, $mdDialog, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory, CallTypesFactory,
                  ParishesFactory, SuppliersFactory, InputsFactory) {
            /**
             * Gets all calls associated with the logged in
             * user id.
             * TODO - New user objects will have a us_user_id field and the function
             * will be updated to reflect this change.
             */
            $scope.isAdmin = false;
            $scope.parish_label = "", $scope.store_label = "";
             UserProfileFactory.show(function(user){
                CallLogsFactory.query({us_user_id: user._id}, function(calls){
                    $scope.calls = calls;
                    $scope.note = calls[0].cc_note;
                }, function(error){
                    $scope.calls = [];
                    $scope.note = "";
                });
            });
            /**
             * Looks up all calls made today.
             */
            lookupCallsForToday = function(){
              CallLogsFactory.query({today: true}, function(calls){
                $scope.total_calls = calls;
              }, function(error){
                $scope.total_calls = [];
              });
            };
            lookupCallsForToday();
            /**
             * looks up current demands
             */
            CurrentDemandsFactory.query(function(demands) {
                    $scope.demands = demands;
                },
                function(error) {
                    $scope.demands = [];
                });
              /**
               * Loads all open transactions
               */
              OpenTransactionsFactory.query(function(o_trans){
                  $scope.open_transactions = o_trans;
              }, function(error){
                $scope.open_transactions = [];
              });
              /**
               * Loads all completed transactions
               */
              TransactionsFactory.query({tr_status: "Completed"}, function(completed_trans){
                  $scope.closed_transactions = completed_trans;
              }, function(error){
                  $scope.closed_transactions = [];
              });
            /**
             * States of the drop down - false = closed
             * @type {{demand: boolean, calls: boolean, transactions: boolean, closed_transactions: boolean}}
             */
            $scope.states = {
                demand: false,
                calls: false,
                transactions: false,
                closed_transactions: false
            };
            /**
             * sets the states of the drop down menus
             * @param item
             */
            $scope.setSelected = function(item) {
                var temp = $scope.states[item];
                for(i in $scope.states) {
                    $scope.states[i] = false;
                }
                $scope.states[item] = temp;
                $scope.states[item] = !$scope.states[item];
            };
            /**
            *
            * Gets the note from a call record
            * and renders it.
            * @param CallLog Object
            **/
            $scope.setSelectedNote = function(call){
                $scope.note = call.cc_note;
            };

            /**
             * Populate parishes with information for the
             * dashboard
             */
            ParishesFactory.query(function(parishes) {
                $scope.parishes = parishes;
            });

            /**
             * Populate all the suppliers to the dashboard for a particular parish
             * TODO: This query isn't restricted!
             */
            SuppliersFactory.query({pa_parish: "Kingston & Saint Andrew"},function(suppliers) {
                $scope.suppliers = suppliers;
            });

            /**
             * Parish based supplier search
             * @param parish
             */
            $scope.supplierSearch = function(parish) {
                SuppliersFactory.query({pa_parish: parish.pa_parish_name}, function(suppliers) {
                    $scope.store_label = "";
                    $scope.suppliers = suppliers;
                    $scope.parish_label = parish.pa_parish_name;
                    $scope.inputs = [];
                });
            };
            /**
             *
             */
            $scope.inputSearch = function(supplier) {
                InputsFactory.query({su_supplier:supplier._id}, function(inputs) {
                    $scope.inputs = inputs;
                    $scope.store_label = supplier.su_supplier_name;
                });
            };
            /**
             * Populate all inputs to the dashboard for a default parish
             * interface. TODO: This query isn't restricted!
             */
            InputsFactory.query({pa_parish_name:"Kingston & Saint Andrew"}, function(inputs) {
                $scope.inputs = inputs;
                $scope.parish_label = "Kingston & Saint Andrew";
            });
            /**
             * Loads a specific route by name and id
             * @param  {[type]} route Name of the route
             * @param  {[type]} id
             */
            $scope.goTo = function(route, id) {
                $location.url('/' + route + '/' + id);
            };
        }
    ]);
