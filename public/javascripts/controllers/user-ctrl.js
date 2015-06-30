/**
 * Created by matjames007 on 6/28/15.
 */
angular.module('jasmic.controllers')

    /**
     * Intended to be used to create a new user on the system. This should only be
     * accessible to administrators on the JASMIC system.
     */
    .controller('NewUserCtrl', ['$scope', '$location', '$mdDialog', '$routeParams', 'UserProfileFactory',
        function ($scope, $location, $mdDialog, $routeParams, UserProfileFactory) {

        }
    ]);