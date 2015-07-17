/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        'OpenTransactionsFactory', 'TransactionsFactory','CallLogsFactory', 'UserProfileFactory', 
        'CallTypesFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory) {                     
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
                });
            });
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


            /**
             * States of the drop down - false = closed
             * @type {{demand: boolean, calls: boolean, transactions: boolean}}
             */
            $scope.states = {
                demand: false,
                calls: false,
                transactions: false
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
            }
            /**
            *
            * Gets the note from a call record
            * and renders it. 
            * @param CallLog Object 
            **/            
            $scope.setSelectedNote = function(call){
                $scope.note = call.cc_note;
            }
        }
    ]);