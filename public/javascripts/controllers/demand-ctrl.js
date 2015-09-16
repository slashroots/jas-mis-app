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
    .controller('DemandProfileCtrl', ['$scope','$mdToast','$location', '$mdDialog','$routeParams', '$window', 'DemandFactory',
        'DemandMatchFactory', 'UserProfileFactory', 'TransactionFactory', 'ReportFactory', 'ReportsFactory',
        'OpenTransactionsFactory',
        function ($scope, $mdToast, $location, $mdDialog, $routeParams, $window, DemandFactory, DemandMatchFactory,
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
                    $scope.reps = demand.bu_buyer.re_representatives;
                    $scope.combinedSupplyAmount = demand.de_met_amount;
                    $scope.combinedSuppyValue = (demand.de_met_amount * demand.de_price);
                    $scope.totalPercentage = ($scope.combinedSupplyAmount/demand.de_quantity) * 100;
                    $scope.demandMet = demand.de_demand_met;
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
                            tr_quantity: $scope.m_commodities[i].co_quantity,
                            tr_value: ($scope.m_commodities[i].co_price * $scope.m_commodities[i].co_quantity),
                            co_commodity: $scope.m_commodities[i]._id
                        },
                        function(success) {
                            $mdToast.show($mdToast.simple().position('top right').content('Transaction successfully created.'));
                        },
                        function(fail) {
                            $mdToast.show($mdToast.simple().position('top right').content('Unable to create transaction.'));
                        });
                }
                loadOpenTransactions();
                lookupReports();
            };

            /**
             * Default/initial variable states
             */
            $scope.allSelected = false;
            $scope.m_commodities = [];
            $scope.transactionSelected = false;
            $scope.updateTransaction = false;
            $scope.transction_states = ['Pending','Completed', 'Failed', 'Waiting'];
            $scope.showNote = false;
            $scope.transaction_completed = false;
            $scope.selectedBuyerReports = [];
            $scope.multi_report = true;
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
                $scope.combinedSupplyAmount += $scope.demand.de_met_amount;
                $scope.combinedSuppyValue += ($scope.demand.de_met_amount * $scope.demand.de_price);
                $scope.totalPercentage += ($scope.combinedSupplyAmount/$scope.demand.de_quantity) * 100;
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
                $scope.transactionSelected = true;
                if($scope.transaction.tr_status === 'Completed'){
                    $scope.transaction_completed = !$scope.transaction_completed;
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
                loadOpenTransactions();
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
                    $mdToast.show($mdToast.simple().position('top right').content('Transaction Status Updated.'));
                }, function(error){
                    $mdToast.show($mdToast.simple().position('top right').content('Transaction Status Not Updated.'));
                });
                $scope.transaction = {};
                $scope.transactionSelected = !$scope.transactionSelected;
                $scope.updateTransaction = !$scope.updateTransaction;
            };
            /**
             * Shows dialog to choose buyer report to be emailed.
             */
            $scope.emailReport = function(){
                $scope.multi_report = true;
                showSendEmailDialog($mdDialog,$scope);
            };
            /**
             * Displays a buyer report given a report id
             * @param  {String} report_id Id of the buyer report to be displayed
             */
            $scope.viewReport = function(report_id){
              var newWindow = window.open('/report/' + report_id);
            };
            /**
             * Emails a buyer report by id.
             * @param  {String} report_id Buyer report id
             */
            $scope.emailReportById = function(report_id){
              $scope.multi_report = false;
              $scope.selectedBuyerReports.push(report_id);
              $window.scrollTo(0,0);
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
            $scope.reps = loadReps();
            $scope.selectedReps = [];
            $scope.sentEmails = [];
            $scope.selectedItem = null;
            $scope.searchText = null;

            $scope.querySearch = function(query) {
              var results = query ? $scope.reps.filter(createFilterFor(query)) : [];
              return results;
            }

            function createFilterFor(query) {
              var lowercaseQuery = angular.lowercase(query);
              return function filterFn(rep) {
                return (rep._lowername.indexOf(lowercaseQuery) === 0) ||
                    (rep._lowertype.indexOf(lowercaseQuery) === 0);
                  };
                }

                function loadReps() {
                  var reps = $scope.demand.bu_buyer.re_representatives;
                  reps.push({re_name: $scope.demand.bu_buyer.bu_buyer_name,
                      re_email: $scope.demand.bu_buyer.bu_email})

                   return reps.map(function (rep) {
                  rep._lowername = rep.re_name.toLowerCase();
                  rep._lowertype = rep.re_email.toLowerCase();
                  return rep;
              });
            }
            $scope.selectedReport = function(report_id){
                $scope.selectedBuyerReports.push(report_id);
            };
            /*
             *  Dismisses the dialog box.
             */
            $scope.cancel = function(){
                $mdDialog.hide();
            };

            isEmailAddressAndReportSelected = function(){
              if($scope.selectedBuyerReports.length === 0 &&
               $scope.selectedReps.length === 0){
                 return true;
               }else{
                 return false;
               }
            }
            /**
             * Email(s) selected buyer report(s).
             * TODO - Handle error and success in the below function better.
             */
            $scope.emailBuyerReport = function(){
                var emails =  [];
                if(isEmailAddressAndReportSelected()){
                    for (var j in $scope.selectedReps)
                        emails.push($scope.selectedReps[j].re_email);

                    for(var i in $scope.selectedBuyerReports)
                    {
                        var report_url = '/report/' + $scope.selectedBuyerReports[i];
                        var report_id = $scope.selectedBuyerReports[i];
                        $http.get(report_url,{params: {email_report: true}}).then(function(response){
                            EmailFactory.create({
                                                  to: emails,
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
                    $scope.selectedReps = [];
                }else{
                  $mdToast.show($mdToast.simple().position('bottom').content('No Email or Buyer Report Seleted'));
                }
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
