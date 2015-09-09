/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        'OpenTransactionsFactory', 'TransactionsFactory','CallLogsFactory', 'UserProfileFactory',
        'CallTypesFactory',  'ParishesFactory', 'SuppliersFactory', 'InputsFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory, CallTypesFactory,
                  ParishesFactory, SuppliersFactory, InputsFactory) {
            /**
             * Gets all calls associated with the logged in
             * user id.
             * TODO - New user objects will have a us_user_id field and the function
             * will be updated to reflect this change.
             */
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
            CurrentDemandsFactory.query( function(demands) {
                    $scope.demands = demands;
                },
                function(error) {
                    $scope.demands = [];
                });

            /**
             * Looks up all opened transactions
             */
            OpenTransactionsFactory.query(function (o_trans) {
                    $scope.open_transactions = o_trans;
                },
                function(err) {
                    $scope.open_transactions = [];
                });

            TransactionsFactory.query({tr_status: "Completed"}, function(closed_transactions){
              $scope.closed_transactions = closed_transactions;
            }, function(error){
              $scope.closed_transactions = [];
            });
            /**
            * Quick way to simulate price dashboard UX
            * TODO - create appropriate service and endpoints.
             */
            $scope.labels = ["January", "February", "March", "April", "May"];
            $scope.series = ['2014 ', '2015'];
            $scope.commodities = [{crop_name: "Onion", variety:"Cherry", season:"All Year",
                                  grow_time: "2", prices: [[100, 150, 80, 81, 90],
                                  [200, 85, 90, 100, 135]] },
                              {crop_name: "Tomatoes", variety:"Red", season:"All Year", grow_time: "2",
                              prices: [[150, 100, 80, 77, 90],
                              [50, 85, 90, 100, 90]]}];

            $scope.crop_details = $scope.commodities[0];
            $scope.data = $scope.commodities[0].prices;

            $scope.onClick = function (points, evt) {
                 console.log(points, evt);
               };

            $scope.updateChart = function(commodity, index){
              $scope.crop_details = $scope.commodities[index];
              $scope.data = $scope.commodities[index].prices;
            };
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
             * Populate all the suppliers to the dashboard
             * interface TODO: This query isn't restricted!
             */
            SuppliersFactory.query(function(suppliers) {
                $scope.suppliers = suppliers;
            });

            /**
             * Parish based supplier search
             * @param parish
             */
            $scope.supplierSearch = function(parish) {
                SuppliersFactory.query({pa_parish: parish.pa_parish_name}, function(suppliers) {
                    $scope.suppliers = suppliers;
                    $scope.inputs = [];
                });
            };

            /**
             *
             */
            $scope.inputSearch = function(supplier) {
                InputsFactory.query({su_supplier:supplier._id}, function(inputs) {
                    $scope.inputs = inputs;
                });
            };

            /**
             * Populate all the inputs to the dashboard
             * interface. TODO: This query isn't restricted!
             */
            InputsFactory.query(function(inputs) {
                $scope.inputs = inputs;
            })
        }
    ]);
