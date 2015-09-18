/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('InputListingCtrl', ['$scope','$location','$routeParams', 'SearchInputsFactory',
        function ($scope, $location, $routeParams, SearchInputsFactory) {

        }
    ])
    .controller('NewSupplierCtrl', ['$scope','$location','$routeParams', 'SupplierFactory', 'ParishesFactory',
        function ($scope, $location, $routeParams, SupplierFactory, ParishesFactory) {
            /**
             * Clears and closes the supplier form
             */
            $scope.cancel = function(){
                $scope.supplier = {};
                $location.url('/dashboard');
            };

            $scope.save = function() {
                SupplierFactory.create($scope.supplier, function(supplier) {
                    $location.url('supplier/'+supplier._id);
                }, function(error) {
                    console.log(error);
                })
            };
            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                }
            );
        }
    ])
    .controller('SupplierProfileCtrl', ['$scope','$location','$routeParams', 'SupplierFactory',
        function ($scope, $location, $routeParams, SupplierFactory) {

            SupplierFactory.show({id: $routeParams.id}, function(supplier) {
                $scope.supplier = supplier;
            }, function(error) {
                $scope.supplier = {};
            });

            $scope.isValid = isValid;

            $scope.toggleInputForm = function() {
                $scope.new_input = !$scope.new_input;
                $scope.input = {};
            };

            $scope.new_input = false;
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
