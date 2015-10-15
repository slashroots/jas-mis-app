/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', '$mdDialog','CurrentDemandsFactory',
        'OpenTransactionsFactory', 'TransactionsFactory','CallLogsFactory', 'UserProfileFactory',
        'CallTypesFactory',  'ParishesFactory', 'SuppliersFactory', 'InputsFactory','StatisticsFactory',
        function ($scope, $location, $routeParams, $mdDialog, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory, CallTypesFactory,
                  ParishesFactory, SuppliersFactory, InputsFactory, StatisticsFactory) {
            /**
             * Gets all calls associated with the logged in
             * user id.
             * TODO - New user objects will have a us_user_id field and the function
             * will be updated to reflect this change.
             */
            $scope.isAdmin = false;
            $scope.parish_label = "", $scope.store_label = "";
            $scope.showIcon = {};
            $scope.metric = {};
            var icons = {increase: "/images/ic_arrow_up_24px.svg", decrease: "/images/ic_arrow_down_24px.svg", neutral: "/images/icons/icons_star.svg" };
             UserProfileFactory.show(function(user){
                CallLogsFactory.query({us_user_id: user._id}, function(calls){
                    if(calls.length > 0){
                      $scope.calls = calls;
                      $scope.note = calls[0].cc_note;
                    }
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
             * Gets performance metrics to be displayed.
             */
            getStatistics = function(){
              StatisticsFactory.show({}, function(stats){
                $scope.stats = stats;
                showPerformanceMetricIcons();
              })
            }
            getStatistics();
            /**
             * Determines if a up, down or equal arrow is to be shown.
             */
            showPerformanceMetricIcons = function(){
              if($scope.stats.call.changes.change === "none"){
                $scope.metric.calls = icons.neutral;
              }else if($scope.stats.call.changes.change === "increase"){
                $scope.metric.calls = icons.increase;
              }else{
                $scope.metric.calls = icons.decrease;
              }

              if($scope.stats.completed_trans.changes.change === "none"){
                $scope.metric.closed_trans = icons.neutral;
              }else if($scope.stats.completed_trans.changes.change === "increase"){
                $scope.metric.closed_trans = icons.increase;
              }else{
                $scope.metric.closed_trans = icons.decrease;
              }

              if($scope.stats.pending_trans.changes.change === "none"){
                $scope.metric.pending_trans = icons.neutral;
              }else if($scope.stats.pending_trans.changes.change === "increase"){
                $scope.metric.pending_trans = icons.increase;
              }else{
                $scope.metric.pending_trans = icons.decrease;
              }

              if($scope.stats.demand.changes.change === "none"){
                $scope.metric.demands = icons.neutral;
              }else if($scope.stats.demand.changes.change === "increase"){
                $scope.metric.demands = icons.increase;
              }else{
                $scope.metric.demands = icons.decrease;
              }
            }
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
            SuppliersFactory.query({pa_parish_code: "default"},function(suppliers) {
                $scope.suppliers = suppliers;
                $scope.parish_label = $scope.suppliers[0].pa_parish;
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
            /*
             * Loads a specific route by name and id
             * @param  {[type]} route Name of the route
             * @param  {[type]} id
             */
            $scope.goTo = function(route, id) {
                $location.url('/' + route + '/' + id);
            };
        }
    ]);
