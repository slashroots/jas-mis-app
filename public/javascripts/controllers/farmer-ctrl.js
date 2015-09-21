/**
 * Created by matjames007 on 4/29/15.
 */

angular.module('jasmic.controllers')

    /**
     *  This controller is used to handle the displaying of information on the
     *  Farmer Listing Page.
     */
    .controller('FarmerListingCtrl', ['$scope', '$mdDialog', '$location', '$routeParams','FarmersFactory',
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
    .controller('FarmerProfileCtrl', ['$scope', '$window', '$location', '$routeParams', '$mdDialog', 'OpenTransactionsFactory',
        'TransactionsFactory', 'FarmerFactory', 'ParishesFactory', 'FarmerFarmFactory', 'CropsFactory',
        'UnitsFactory', 'CommodityFactory','CommoditiesFactory', 'DistrictsFactory', 'FarmerMembershipsFactory','CommodityEditFactory', 'FarmEditFactory',
        function ($scope, $window, $location, $routeParams, $mdDialog, OpenTransactionsFactory, TransactionsFactory,
                FarmerFactory, ParishesFactory, FarmerFarmFactory, CropsFactory, UnitsFactory,
                CommodityFactory, CommoditiesFactory, DistrictsFactory, FarmerMembershipsFactory, CommodityEditFactory, FarmEditFactory) {
            /**
             * First query for the farmer based on the id supplied in the parameters,
             * then query for the transactions this farmer has been involved in.
             * TODO: Finish up this!
             */
            function loadAll() {
                FarmerFactory.show({id:$routeParams.id}, function(farmer) {
                    $scope.farmer = farmer;
                    $scope.completedTransactions = TransactionsFactory.query({
                        fr_farmer: farmer._id, tr_status: 'Completed'
                    });
                    $scope.openTransactions = OpenTransactionsFactory.query({
                        fr_farmer: farmer._id
                    });
                    $scope.disputes = []; //TODO:  Create and Generate Endpoints and Functions
                }, function(err) {
                    console.log(err);
                });
            };
            function populateCommodities() {
                CommoditiesFactory.query({id: $routeParams.id}, function(list) {
                    $scope.commodities = list;
                }, function(fail) {
                    console.log(fail);
                });
            };
            FarmerMembershipsFactory.show({id: $routeParams.id}, function(memberships) {
                $scope.memberships = memberships;
            });
            loadAll();
            populateCommodities();

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

            $scope.isActive = function(exp_date) {
                if(new Date(exp_date) > Date.now()) {
                    return true;
                } else {
                    return false;
                }
            };

            /**
             * Attempts to add new Farm to the farmer object.  Assumes the
             * server will take care of the address creation.
             */
            $scope.addNewFarm = function() {
                $scope.farm.di_district = selectedDistrict;
                FarmerFarmFactory.create({id:$scope.farmer._id}, $scope.farm, function(success) {
                    $scope.newFarm = !$scope.newFarm;
                    loadAll();
                }, function(fail) {
                    console.log(fail);
                    console.log($scope.farm);
                    showDialog($mdDialog, fail, true);
                });
            };

            $scope.cancelAdd = function() {
                $scope.newFarm = !$scope.newFarm;
            };

            $scope.cancelFarmEdit = function() {
                $scope.editFarm = !$scope.editFarm;
            };

            /*.updateFarm = function() {
                $scope.farm.di_district = selectedDistrict;
                FarmerFarmFactory.create({id:$scope.farmer._id}, $scope.farm, function(success) {
                    $scope.newFarm = !$scope.newFarm;
                    loadAll();
                }, function(fail) {
                    console.log(fail);
                    console.log($scope.farm);
                    showDialog($mdDialog, fail, true);
                });
            };*/

            $scope.cancelEdit = function() {
                $scope.editFarm = !$scope.editFarm;
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
                $scope.farm = {};
            };

            $scope.editFarmLocation = function(arrayindex) {

                $scope.editFarm = !$scope.editFarm;
                $scope.farm = $scope.farmer.fr_farms[arrayindex];

                $scope.editingFarm = arrayindex;//set the farm currently being edited

            };

            $scope.newCommodityItem = function() {
                $scope.newCommodity = !$scope.newCommodity;
                $scope.commodity = {};
                $scope.commodity.co_availability_date= moment().toDate();
                $scope.commodity.co_until = moment().add(7, 'days').toDate();
            };

            $scope.editCommodityItem = function(arrayindex) {

                $scope.editCommodity = !$scope.editCommodity;
                $scope.commodity = $scope.commodities[arrayindex];
                $scope.commodity.co_availability_date= moment().toDate();
                $scope.commodity.co_until = moment().add(7, 'days').toDate();

                $scope.editingCommodity = arrayindex;//sets the commodity currently being edited

            };

            $scope.updateCommodity = function() {

                CommodityEditFactory.update({id:$scope.commodities[$scope.editingCommodity].fa_farmer._id, commodity_id:$scope.commodity._id}, $scope.commodity, function(success) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);

                    $scope.editCommodity = false;

                }, function (error) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Error Updating Commodity!"}, true);

                });

            }


            $scope.updateFarm = function() {

                $scope.editFarm = false;

                FarmEditFactory.update({id:$scope.farmer._id, farm_id:$scope.farm._id}, $scope.farm, function(success) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);

                }, function (error) {

                    $window.scrollTo(0,0);

                    showDialog($mdDialog, {statusText:"Error Updating Farm!"}, true);

                });

            }


            $scope.newCommodity = false;
            $scope.newFarm = false;
            $scope.editCommodity = false;

            $scope.commodity = {};
            var selectedCrop;
            var selectedDistrict;

            /**
             * Open the page for editing the farmer.
             */
            $scope.editFarmer = function() {
                $location.url('farmer/'+$scope.farmer._id+'/edit');
            };

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
             * Fetches the units that user can select
             */
            $scope.units = UnitsFactory.query({});

            $scope.saveCommodity = function() {
                $scope.commodity.cr_crop = selectedCrop;
                CommodityFactory.create({id:$scope.farmer._id}, $scope.commodity, function(success) {
                    $scope.newCommodityItem();
                    populateCommodities();
                }, function(error) {
                    showDialog($mdDialog, error, true);
                })
            }

            /**
             *  This function does the magic for the auto-complete district selection
             *  tool.  The API looks out for a key called 'beginsWith' and they
             *  constructs a regex expression that searches for the district and
             *  returns a list matching the expression.
             */
            $scope.queryDistrictSearch = function(districtName) {
                return DistrictsFactory.query({beginsWith: districtName});
            };
            $scope.selectedDistrictChange = function(item) {
                selectedDistrict = item._id;
            };
        }
    ])
    /**
     * TODO:  Incomplete New Farmer Controller that utilizes the same view as the
     * edit farmer view
     */
    .controller('NewFarmerCtrl', ['$scope', '$routeParams', '$window', 'FarmerFactory',
        function ($scope, $routeParams, $window, FarmerFactory) {
            $scope.save = function() {
                console.log($scope.farmer);
            };

            $scope.cancel = function(){
                $window.history.back();
            };
        }
    ])
    /**
     * This controller is responsible for the querying of the farmer by id,
     * then creation of the farmer object for the view to render.  It also
     * populates the parishes combo box for user interaction.
     */
    .controller('EditFarmerCtrl', ['$scope', '$location', '$mdDialog','$routeParams', '$window', 'FarmerFactory', 'ParishesFactory',
        function ($scope, $location, $mdDialog, $routeParams, $window, FarmerFactory, ParishesFactory) {
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
                FarmerFactory.update({id:$scope.farmer._id}, $scope.farmer, function(success) {
                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);
                    $location.url('farmer/' + success._id);
                }, function(error) {
                    showDialog($mdDialog, error, true);
                });
            };

            $scope.cancel = function(){
                $window.history.back();
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
