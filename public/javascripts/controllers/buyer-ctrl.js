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
    .controller('NewBuyerCtrl', ['$scope', '$routeParams', 'BuyerFactory', 'BuyerTypesListingFactory',
            'ParishesFactory',
        function ($scope, $routeParams, BuyerFactory, BuyerTypesListingFactory, ParishesFactory) {
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
                    //TODO: Handle this!!!
                    console.log(success);
                },
                function(fail) {
                    //TODO: Handle this!!!
                    console.log(fail);
                });
            };
        }
    ]);