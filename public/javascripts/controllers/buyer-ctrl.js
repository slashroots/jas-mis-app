/**
 * Created by matjames007 on 5/18/15.
 */
angular.module('jasmic.controllers')

/**
 *  This controller is used to handle the displaying of information on the
 *  Buyer Listing Page.
 */
    .controller('BuyersListingCtrl', ['$scope', '$mdDialog', '$location', '$routeParams', 'BuyersListingFactory',
        function ($scope, $mdDialog, $location, $routeParams, BuyersListingFactory) {
            BuyersListingFactory.query($routeParams, function(buyers) {
                $scope.buyers = buyers;
            }, function(error) {
                showDialog($mdDialog, error, true);
            });
            $scope.selected = false;

            $scope.selectedElement = function(buyer) {
                $scope.selectedBuyer = buyer;
                $scope.selected = true;
            };

            $scope.goToBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id);
            };

            $scope.editBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id+'/edit');
            };

        }
    ])
/**
 * TODO:  Incomplete New Farmer Controller that utilizes the same view as the
 * edit farmer view
 */
    .controller('NewBuyerCtrl', ['$scope', '$location', '$mdDialog', '$routeParams', 'BuyerFactory', 'BuyerTypesListingFactory',
        'ParishesFactory',
        function ($scope, $location, $mdDialog, $routeParams, BuyerFactory, BuyerTypesListingFactory, ParishesFactory) {
            BuyerTypesListingFactory.query(function(buyertypes) {
                $scope.buyerTypes = buyertypes;
            }, function(fail) {
                //TODO:  I need to ensure that I handle these properly
            });

            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            $scope.save = function() {
                BuyerFactory.create($scope.buyer, function(success) {
                        showDialog($mdDialog, {statusText:"Successfully Saved!"}, false);
                        $location.url('buyer/'+ success._id);
                    },
                    function(fail) {
                        showDialog($mdDialog, fail, true);
                    });
            };
        }
    ])
/**
 * This controller is responsible for the querying of the buyer by id,
 * then creation of the buyer object for the view to render.  It also
 * populates the parishes combo box for user interaction.
 */
    .controller('EditBuyerCtrl', ['$location', '$scope', '$window', '$mdDialog','$routeParams', 'BuyerFactory',
        'ParishesFactory', 'BuyerTypesListingFactory',
        function ($location, $scope, $window, $mdDialog, $routeParams, BuyerFactory, ParishesFactory, BuyerTypesListingFactory) {
            BuyerFactory.show({id:$routeParams.id},
                function(buyer) {
                    $scope.buyer = buyer;
                },
                function(error) {
                    showDialog($mdDialog, error, true);
                });

            BuyerTypesListingFactory.query({}, function(bTypes) {
                $scope.buyerTypes = bTypes;
            }, function(failure) {

            });

            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            $scope.save = function() {
                BuyerFactory.update({id:$scope.buyer._id}, $scope.buyer, function(success) {
                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);
                    $location.url('buyer/'+ success._id);
                }, function(error) {
                    showDialog($mdDialog, error, true);
                });
            };

        }
    ])

/**
 *  Controller logic for the profile page of a buyer.
 *  TODO: Document this controller!
 */
    .controller('BuyerProfileCtrl', ['$location','$scope', '$window', '$mdDialog','$routeParams', 'BuyerFactory',
        'BuyerTypesListingFactory', 'OpenTransactionsFactory', 'TransactionsFactory', 'RepFactory', 'CropsFactory', 'UnitsFactory',
        'BuyerDemandFactory', 'DemandsFactory',
        function ($location, $scope, $window, $mdDialog, $routeParams, BuyerFactory, BuyerTypesListingFactory,
                  OpenTransactionsFactory, TransactionsFactory, RepFactory, CropsFactory, UnitsFactory,
                  BuyerDemandFactory, DemandsFactory) {

            /**
             * Start the page by setting up the buyer.  This section retrieves the
             * buyer based on the supplied id in the $routeParams.  Also attempts to
             * find the various transactions in progress and completed.
             *
             * TODO:  Create and Generate Endpoints and Functions for disputes
             */
            function loadAll() {
                BuyerFactory.show({id: $routeParams.id},
                    function (buyer) {
                        $scope.buyer = buyer;
                        $scope.completedTransactions = TransactionsFactory.query({
                            bu_buyer: buyer._id, tr_status: 'Completed'
                        });
                        $scope.openTransactions = OpenTransactionsFactory.query({
                            bu_buyer: buyer._id
                        });
                        $scope.disputes = [];
                    },
                    function (error) {
                        showDialog($mdDialog, error, true);
                    });
            };
            function populateDemands() {
                DemandsFactory.query({id: $routeParams.id}, function(listing) {
                    $scope.demands = listing;
                }, function(fail) {
                    console.log(fail);
                });
            };
            loadAll();
            populateDemands();

            /**
             * Fetches the units that user can select
             */
            $scope.units = UnitsFactory.query({});

            $scope.isValid = isValid;
            $scope.isBuyerContext = true;

            /**
             * Move to the edit page for the buyer from profile
             * page.
             */
            $scope.editBuyer = function() {
                $location.url('buyer/'+$scope.buyer._id+'/edit');
            };


            /**
             * This attempts to create a new representative and associate he/she with the
             * buying institution or company
             */
            $scope.addNewRep = function() {
                RepFactory.create({id: $scope.buyer._id},$scope.representative, function(success) {
                        $scope.buyer = success;
                        showDialog($mdDialog, {statusText:"Successfully Added Rep!"}, false);
                        $scope.new_rep = false;
                        $scope.representative = {};
                    },
                    function(err) {
                        showDialog($mdDialog, err, true);
                    });
            };

            /**
             * This section sets up the representative/demand capture features.
             */
            $scope.representative = {};
            $scope.demand = {};
            $scope.new_rep = false;
            $scope.edit_rep = false;
            $scope.new_demand = false;
            $scope.edit_demand = false;
            $scope.toggleRepForm = function() {
                $scope.new_rep = !$scope.new_rep;
                $scope.representative = {};
            };
            $scope.toggleDemandForm = function() {
                $scope.new_demand = !$scope.new_demand;
                $scope.demand = {};
                $scope.demand.de_posting_date= moment().toDate();
                $scope.demand.de_until = moment().add(7, 'days').toDate();
            };

            $scope.editDemandForm = function (index) {

                $scope.edit_demand = !$scope.edit_demand;

                $scope.demand = $scope.demands[index];

                $scope.demand.de_posting_date= moment().toDate();

                $scope.demand.de_until = moment().add(7, 'days').toDate();

            }

            $scope.editRepForm = function (index) {

                $scope.edit_rep = !$scope.edit_rep;

                $scope.representative = $scope.buyer.re_representatives[index];

            }

            $scope.updateDemand = function() {

                $scope.edit_demand = !$scope.edit_demand;

                DemandEditFactory.update({id:$scope.demands[0].bu_buyer._id, demand_id:$scope.demand._id}, $scope.demand, function(success) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);

                }, function (error) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Error Updating Demand!"}, false);

                });

            }


            $scope.updateRep = function() {

                $scope.edit_rep = !$scope.edit_rep;

                RepEditFactory.update({id:$scope.buyer._id, rep_id:$scope.representative._id}, $scope.representative, function(success) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);

                }, function (error) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Error Updating Employee!"}, false);

                });

            }


            /**
             *  This function does the magic for the auto-complete crop selection
             *  tool.  The API looks out for a key called 'beginsWith' and they
             *  constructs a regex expression that searches for the crop name and
             *  returns a list matching the expression.
             */
            $scope.queryCropSearch = function(cropName) {
                return CropsFactory.query({beginsWith: cropName});
            };
            $scope.selectedItemChange = function(item) {
                selectedCrop = item._id;
            };

            /**
             * Attempts to save the demand.
             */
            $scope.saveDemand = function() {

                $scope.demand.cr_crop = selectedCrop;
                BuyerDemandFactory.create({id:$scope.buyer._id}, $scope.demand, function(success) {
                    $scope.toggleDemandForm();
                    populateDemands();
                }, function(error) {
                    showDialog($mdDialog, error, true);
                })
            }
        }
    ]);


/**
 * Quick and dirty check to see if information is present for
 * manipulation
 * @param obj
 * @returns {boolean}
 */
isValid = function(obj) {
    if(obj == undefined) {
        return false;
    } else if(obj == '') {
        return false;
    } else {
        return true;
    }
};