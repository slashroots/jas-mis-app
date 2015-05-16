/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic.controllers')

    /**
     *  This controller is used to handle the displaying of information on the
     *  Farmer Listing Page.
     */
    .controller('FarmerListingCtrl', ['$scope', '$mdDialog', '$location', '$routeParams', 'FarmersFactory',
        function ($scope, $mdDialog, $location, $routeParams, FarmersFactory) {
            FarmersFactory.query($routeParams, function(farmers) {
                $scope.farmers = farmers;
            }, function(error) {
                showDialog($mdDialog, error, true);
            });
            $scope.selected = false;

            $scope.selectedElement = function(farmer) {
                $scope.selectedFarmer = farmer;
                $scope.selected = true;
            };

            $scope.goToFarmer = function() {
                $location.url('farmer/'+$scope.selectedFarmer._id);
            };

            $scope.editFarmer = function() {
                $location.url('farmer/'+$scope.selectedFarmer._id+'/edit');
            };
        }
    ])

    /**
     * This controller does a query to retrieve the farmer by the specified ID in the
     * routeParameter.  It then creates the $scope.farmer object for the view to consume
     */
    .controller('FarmerProfileCtrl', ['$scope', '$location', '$routeParams', '$mdDialog',
        'TransactionsFactory', 'FarmerFactory', 'ParishesFactory', 'FarmerFarmFactory',
        function ($scope, $location, $routeParams, $mdDialog, TransactionsFactory,
                 FarmerFactory, ParishesFactory, FarmerFarmFactory) {
            /**
             * First query for the farmer based on the id supplied in the parameters,
             * then query for the transactions this farmer has been involved in.
             * TODO: Finish up this!
             */
            FarmerFactory.show({id:$routeParams.id}, function(farmer) {
                $scope.farmer = farmer;
                $scope.completedTransactions = TransactionsFactory.query({
                    fr_farmer: farmer._id, tr_status: 'Completed'
                });
                $scope.pendingTransactions = TransactionsFactory.query({
                    fr_farmer: farmer._id, tr_status: 'Pending'
                });
                $scope.disputes = []; //TODO:  Create and Generate Endpoints and Functions
            }, function(err) {
                console.log(err);
            });

            /**
             * Quick and dirty check to see if information is present for
             * manipulation
             * @param obj
             * @returns {boolean}
             */
            $scope.isValid = function(obj) {
                if(obj == undefined) {
                    return false;
                } else if(obj == '') {
                    return false;
                } else {
                    return true;
                }
            };

            /**
             * Attempts to add new Farm to the farmer object.  Assumes the
             * server will take care of the address creation.
             */
            $scope.addNewFarm = function() {
                $scope.farm.ad_country = "Jamaica";
                FarmerFarmFactory.create({id:$scope.farmer._id}, $scope.farm, function(success) {
                    showDialog($mdDialog, {statusText:"Successfully Added!"}, false);
                    $scope.farmer = success;
                    $scope.newFarm = !$scope.newFarm;
                }, function(fail) {
                    showDialog($mdDialog, fail, true);
                });
            };

            /**
             * Necessary to load all parishes in the necessary forms
             */
            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            /**
             * Button related functions and variables for hiding/showing
             * new forms
             */
            $scope.newFarmLocation = function() {
                $scope.newFarm = !$scope.newFarm;
            };
            $scope.newCommodityItem = function() {
                $scope.newCommodity = !$scope.newCommodity;
            };
            $scope.newCommodity = false;
            $scope.newFarm = false;
            $scope.farm = {};

            /**
             * Open the page for editing the farmer.
             */
            $scope.editFarmer = function() {
                $location.url('farmer/'+$scope.farmer._id+'/edit');
            };

            /**
             * TODO: Incomplete!
             */
            $scope.findAndSelectCrop = function() {
                var pa = angular.element(document.body);
                $mdDialog.show({
                    parent: pa,
                    clickOutsideToClose: true,
                    scope: $scope,        // use parent scope in template
                    preserveScope: true,
                    templateUrl:'/partials/crop_listing.html'
                });
            };
        }
    ])
    /**
     * TODO:  Incomplete New Farmer Controller that utilizes the same view as the
     * edit farmer view
     */
    .controller('NewFarmerCtrl', ['$scope', '$routeParams', 'FarmerFactory',
        function ($scope, $routeParams, FarmerFactory) {
            $scope.save = function() {
                console.log($scope.farmer);
            };
        }
    ])
    /**
     * This controller is responsible for the querying of the farmer by id,
     * then creation of the farmer object for the view to render.  It also
     * populates the parishes combo box for user interaction.
     */
    .controller('EditFarmerCtrl', ['$scope', '$mdDialog','$routeParams', 'FarmerFactory', 'ParishesFactory',
        function ($scope, $mdDialog, $routeParams, FarmerFactory, ParishesFactory) {
            FarmerFactory.show({id:$routeParams.id},
                function(farmer) {
                    $scope.farmer = farmer;
                    if(farmer.fa_dob == '') {
                        $scope.dob = moment(farmer.fa_dob).toDate();
                    } else {
                        $scope.dob = "";
                    }
                },
                function(error) {
                    showDialog($mdDialog, error, true);
                });

            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            $scope.save = function() {
                FarmerFactory.update({id:$scope.farmer._id}, $scope.farmer, function(something) {
                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);
                }, function(error) {
                    showDialog($mdDialog, error, true);
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