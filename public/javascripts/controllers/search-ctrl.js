/**
 * Created by matjames007 on 5/6/15.
 */

angular.module('jasmic.controllers')
    .controller('SearchCtrl', ['$scope','$location','$routeParams', 'SearchAllFactory',
        function ($scope, $location, $routeParams, SearchAllFactory) {
            $scope.results = SearchAllFactory.query($routeParams);
            $scope.terms = $routeParams.searchTerms;

            $scope.searchAll = function() {
                $location.url("/search?searchTerms=" + $scope.search);
            }
        }
    ]);