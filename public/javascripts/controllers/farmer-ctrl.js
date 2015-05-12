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
                showDialog($mdDialog, null, error, true);
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
     * routeParameter.  It then creates the $scoe.farmer object for the view to consume
     */
    .controller('FarmerProfileCtrl', ['$scope', '$location', '$routeParams', 'FarmerFactory',
        function ($scope, $location, $routeParams, FarmerFactory) {
            $scope.farmer = FarmerFactory.show({id:$routeParams.id});
            $scope.isValid = function(obj) {
                if(obj == undefined) {
                    return false;
                } else if(obj == '') {
                    return false;
                } else {
                    return true;
                }
            };
            $scope.editFarmer = function() {
                $location.url('farmer/'+$scope.farmer._id+'/edit');
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
                //save the farmer!
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
                    $scope.dob = moment(farmer.fa_dob).toDate();
                },
                function(error) {
                    console.log(error);
                    showDialog($mdDialog, null, error, true);
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
                    console.log(something);
                    showDialog($mdDialog, null, {statusText:"Successfully Updated!"}, false);
                }, function(error) {
                    showDialog($mdDialog, null, error, true);
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
function showDialog($mdDialog, ev, message, isError) {
    $mdDialog.show(
        $mdDialog.alert()
            .parent(angular.element(document.body))
            .title(isError? 'Error Detected':'System Message')
            .content(message.statusText)
            .ariaLabel(isError?'Alert Error':'Alert Message')
            .ok('Ok')
            .targetEvent(ev)
    );
};