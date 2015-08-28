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

            $scope.goToDemand = function() {
                $location.url('demand/' + $scope.selectedDemand._id);
            };

            $scope.itemSelected = false;

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.selectedDemand._id}, function(list) {
                    $scope.m_commodities = list;
                })
            }
        }
    ])
    .controller('DemandProfileCtrl', ['$scope','$mdToast','$location', '$mdDialog','$routeParams', 'DemandFactory',
        'DemandMatchFactory', 'UserProfileFactory', 'TransactionFactory', 'ReportFactory', 'ReportsFactory',
        'OpenTransactionsFactory',
        function ($scope, $mdToast, $location, $mdDialog, $routeParams, DemandFactory, DemandMatchFactory,
                  UserProfileFactory, TransactionFactory, ReportFactory, ReportsFactory, OpenTransactionsFactory) {
            /**
             * Display user profile based on authenticated
             * session information.
             */
            UserProfileFactory.show(function(user) {
                $scope.user = user;
            });
            /**
             * Get all open transactions matching demand.
             */
            loadOpenTransactions = function(){
              OpenTransactionsFactory.query({de_demand:$routeParams.id}, function(transactions){
                 $scope.transactions = transactions;
              }, function(error){
                 $scope.transactions = [];
              });
            };

            loadOpenTransactions();
            /**
             * Lookup Demand information based on ID supplied in the URL.
             */
            DemandFactory.show({id:$routeParams.id},
                function(demand) {
                    $scope.demand = demand;
                    $scope.selectedDemand = demand;
                    lookupDemandMatches();
                    lookupReports();
                },
                function(error) {
                    $scope.demand = {};
                });
            /**
             * Function to run when download pdf button is clicked.
             * This creates a transaction based on items in the
             * transaction cart and triggers download of pdf.
             */
            $scope.downloadPDF = function() {
                //create transaction(s)
                if($scope.m_commodities.length > 0) {
                    //createTransactions();
                } else {
                    $mdToast.show($mdToast.simple().position('top right').content('No Supplies Selected!'));
                }
            };

            createTransactions = function() {
                for(var i in $scope.m_commodities) {
                    TransactionFactory.create({
                            bu_buyer: $scope.demand.bu_buyer,
                            fr_farmer: $scope.m_commodities[i].fa_farmer,
                            cr_crop: $scope.demand.cr_crop,
                            tr_status: 'Pending',
                            us_user_id: $scope.user._id,
                            de_demand: $scope.demand._id,
                            tr_value: ($scope.m_commodities[i].co_price * $scope.m_commodities[i].co_quantity),
                            co_commodity: $scope.m_commodities[i]._id
                        },
                        function(success) {
                            console.log(success);
                        },
                        function(fail) {
                            console.log(fail);
                        });
                }
                loadOpenTransactions();
            };

            /**
             * Default/initial variable states
             */
            $scope.combinedSupplyAmount = 0;
            $scope.combinedSuppyValue = 0;
            $scope.totalPercentage = 0;
            $scope.demandMet = false;
            $scope.allSelected = false;
            $scope.m_commodities = [];
            $scope.transactionSelected = false;
            $scope.updateTransaction = false;
            $scope.transction_states = ['Pending','Completed', 'Failed', 'Waiting'];
            $scope.showNote = false;
            $scope.transaction_completed = false;
            /**
             * Deselect item from the cart.
             * @param commodity
             */
            $scope.remove = function(commodity) {
                commodity.selected = false;
            };

            /**
             * Triggered when an item is checked/unchecked.
             * @param commodity
             */
            $scope.checked = function(commodity) {
                // console.log(commodity);
                var sum = 0;
                $scope.combinedSuppyValue = 0;
                for(var i in $scope.m_commodities) {
                    sum += $scope.m_commodities[i].co_quantity;
                    $scope.combinedSuppyValue +=
                        ($scope.m_commodities[i].co_price * $scope.m_commodities[i].co_quantity);
                }
                $scope.combinedSupplyAmount = sum;
                $scope.totalPercentage = (sum/$scope.demand.de_quantity) * 100;
                if(sum >= $scope.demand.de_quantity) {
                    $scope.demandMet = true;
                } else {
                    $scope.demandMet = false;
                }
            };

            /**
             * Function attempts to match details based on the demand parameters of
             * the demand ID supplied
             */
            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.demand._id}, function(list) {
                    $scope.commodities = list;
                })
            };
            /**
             * Searches for the reports previously generated on this demand.
             */
            lookupReports = function() {
                ReportsFactory.search({
                    de_demand: $scope.demand._id
                }, function(reports) {
                    $scope.reports = reports;
                }, function(fail) {
                    $scope.reports = [];
                });
            };

            /**
             * Create the transactions first then record the generation
             * of the report and then render the report to a new window.
             */
            $scope.createReport = function() {
                if($scope.m_commodities.length > 0) {
                    createTransactions();

                    //This will create the report for the system
                    ReportFactory.create({
                        de_demand: $scope.demand._id,
                        co_commodities: $scope.m_commodities,
                        us_user: $scope.user._id,
                        re_report_name: 'Buyer Report',
                        re_report_date: Date.now()
                    }, function(success) {
                        var newWindow = window.open('/report/' + success._id);

                    }, function(fail) {
                        $mdToast.show($mdToast.simple().position('top right').content('Report Created'));
                    });

                } else {
                    $mdToast.show($mdToast.simple().position('top right').content('No Supplies Selected!'));
                }
                loadOpenTransactions();
                lookupReports();
            };
            /**
             * Gets the clicked transaction from a list of transactions.
             * @param transaction - Details of a specific transaction.
             */
            $scope.selectedTransaction = function(transaction){
                $scope.transaction = transaction;
                $scope.transactionSelected = !$scope.transactionSelected;
                if($scope.transaction.tr_status === 'Completed'){
                    $scope.transaction_completed = !$scope.transaction_completed;
                    //$scope.updateTransaction = !$scope.updateTransaction;
                }
            };
            /**
             * Toggles variable for updating a record.
             */
            $scope.editTransaction = function(){
                $scope.updateTransaction = !$scope.updateTransaction;
            };
            /**
             * Dismisses update transaction card.
             */
            $scope.cancel = function(){
                $scope.transactionSelected = !$scope.transactionSelected;
                $scope.updateTransaction = !$scope.updateTransaction;
            };
            /**
             * Updates a transaction's status
             * TODO - replace Toast messages with dialog boxes.
             */
            $scope.update = function(){
                if($scope.transaction.tr_status === 'Completed'){
                    $scope.transaction.co_sold = true;
                }
                TransactionFactory.update({id:$scope.transaction._id}, $scope.transaction, function(success){
                    $mdToast.show($mdToast.simple().position('top').content('Transaction Status Updated.'));
                }, function(error){
                    $mdToast.show($mdToast.simple().position('top').content('Transaction Status Not Updated.'));
                });
                $scope.transaction = {};
                $scope.transactionSelected = !$scope.transactionSelected;
                $scope.updateTransaction = !$scope.updateTransaction;
            };

            $scope.emailReport = function(){
                    showSendEmailDialog($mdDialog,$scope);
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

function showSendEmailDialog($mdDialog, $scope){
    $mdDialog.show({
        scope: $scope,
        clickOutsideToClose: true,
        preserveScope: true,
        templateUrl: '/partials/email_report.html',
        /**
         * This controller is responsible for all actions
         * done on the Call Input Dialog.
         * @param $scope
         * @param $mdDialog
         */
        controller: function SendEmailDialogController($scope, $route, $mdDialog, $location,
          EmailFactory, $http, $mdToast){
              /*
             *  Gets the selected call type from
             *  drop down menu.
             */
            $scope.selectedBuyerReports = [];
            $scope.sentEmails = [];
            $scope.selectedReport = function(report){
                $scope.selectedBuyerReports.push(report);
            };
            /*
             *  Dismisses the dialog box.
             */
            $scope.cancel = function(){
                $mdDialog.hide();
            };
            /**
             * Email(s) selected buyer report(s).
             * TODO - Handle error and success in the below function better.
             */
            $scope.emailBuyerReport = function(){
                $scope.report_body = "Report";
                for(var i in $scope.selectedBuyerReports)
                {
                    var base_url = $location.absUrl().split('/home');
                    var report_url = base_url[0] + '/report/' + $scope.selectedBuyerReports[i]._id;
                    var report_id = $scope.selectedBuyerReports[i]._id;
                    $http.get(report_url,{params: {email_report: true}}).then(function(response){
                        EmailFactory.create({
                                              //to: $scope.demand.bu_buyer.bu_email,
                                              to: "tremainekbuchanan@gmail.com",
                                              subject: "Buyer Report",
                                              text: "Buyer Report Body",
                                              report_url: report_url,
                                              report_id: report_id,
                                              report_body: response.data
                                            },
                        function(success){
                          $mdToast.show($mdToast.simple().position('top right').content('Email was successfully sent.'));
                        },function(error){
                         $mdToast.show($mdToast.simple().position('top right').content('Email was not sent.'));
                         });
                    }, function(error){
                        $mdToast.show($mdToast.simple().position('top right').content('Unable to get your report'));
                    });
                }
                $mdDialog.hide();
                $scope.selectedBuyerReports = [];
                console.log($scope.sentEmails);
            };
        }//end of controller
    });
};
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
