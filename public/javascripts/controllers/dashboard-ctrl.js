/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DashboardCtrl', ['$scope','$location','$routeParams', '$mdDialog','CurrentDemandsFactory',
        'OpenTransactionsFactory', 'TransactionsFactory','CallLogsFactory', 'UserProfileFactory',
<<<<<<< HEAD
        'CallTypesFactory',  'ParishesFactory', 'SuppliersFactory', 'InputsFactory', 'CropFactory', 'SupplierFactory',
        'UsersFactory','CropsFactory','UserFactory',
        function ($scope, $location, $routeParams, $mdDialog, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory, CallTypesFactory,
                  ParishesFactory, SuppliersFactory, InputsFactory, CropFactory, SupplierFactory, UsersFactory,
                  CropsFactory, UserFactory) {
=======
        'CallTypesFactory',  'ParishesFactory', 'SuppliersFactory', 'InputsFactory', 'SendEmailFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory, OpenTransactionsFactory,
                  TransactionsFactory, CallLogsFactory, UserProfileFactory, CallTypesFactory,
                  ParishesFactory, SuppliersFactory, InputsFactory, SendEmailFactory) {
>>>>>>> develop
            /**
             * Gets all calls associated with the logged in
             * user id.
             * TODO - New user objects will have a us_user_id field and the function
             * will be updated to reflect this change.
             */
             UserProfileFactory.show(function(user){
                 //Used to determine which user is logged in to render appropriate
                 //dashboard.
                $scope.isAdmin = user.ut_user_type === "Administrator" ? true: false;

                 if(!$scope.isAdmin)
                 {
                     CallLogsFactory.query({us_user_id: user._id}, function(calls){
                         $scope.calls = calls;
                         $scope.note = calls[0].cc_note;
                     }, function(error){
                         $scope.calls = [];
                     });
                 }
            });

            //SendEmailFactory.create({
            //    to:       '@33334#@gmail.com',
            //    from:     'tremainebuchanan@gmail.com',
            //    subject:  'Success',
            //    text:     'Hello world'}, function(success){
            //    console.log(success);
            //}, function(error){
            //   console.log('Error');
            //});

            /**
             * looks up current demands
             */
            CurrentDemandsFactory.query( function(demands) {
                    $scope.demands = demands;
                },
                function(error) {
                    $scope.demands = [];
                });

            /**
             * Looks up all opened transactions
             */
            OpenTransactionsFactory.query(function (o_trans) {
                    $scope.open_transactions = o_trans;
                },
                function(err) {
                    $scope.open_transactions = [];
                });
            /**
             * States of the drop down - false = closed
             * @type {{demand: boolean, calls: boolean, transactions: boolean}}
             */
            $scope.states = {
                demand: false,
                calls: false,
                transactions: false
            };
            /**
             * sets the states of the drop down menus
             * @param item
             */
            $scope.setSelected = function(item) {
                var temp = $scope.states[item];
                for(i in $scope.states) {
                    $scope.states[i] = false;
                }
                $scope.states[item] = temp;
                $scope.states[item] = !$scope.states[item];
            };
            /**
            *
            * Gets the note from a call record
            * and renders it.
            * @param CallLog Object
            **/
            $scope.setSelectedNote = function(call){
                $scope.note = call.cc_note;
            };

            /**
             * Populate parishes with information for the
             * dashboard
             */
            ParishesFactory.query(function(parishes) {
                $scope.parishes = parishes;
            });

            /**
             * Populate all the suppliers to the dashboard
             * interface TODO: This query isn't restricted!
             */
            SuppliersFactory.query(function(suppliers) {
                $scope.suppliers = suppliers;
            });

            /**
             * Parish based supplier search
             * @param parish
             */
            $scope.supplierSearch = function(parish) {
                SuppliersFactory.query({pa_parish: parish.pa_parish_name}, function(suppliers) {
                    $scope.suppliers = suppliers;
                    $scope.inputs = [];
                });
            };
            /**
             *
             */
            $scope.inputSearch = function(supplier) {
                InputsFactory.query({su_supplier:supplier._id}, function(inputs) {
                    $scope.inputs = inputs;
                });
            };
            /**
             * Populate all the inputs to the dashboard
             * interface. TODO: This query isn't restricted!
             */
            InputsFactory.query(function(inputs) {
                $scope.inputs = inputs;
            });
            /**
             * Admin Functions
             * If the user is an Administrator,
             * give the user access to admin functions
             * of the dashboard.
             */
           if($scope.isAdmin){
               /**
                * Get all users from the database.
                */
               getUsers = function(){
                   UsersFactory.show(function(users){
                       $scope.users = users;
                   }, function(error){
                       $scope.users = [];
                   });
               };
               getUsers();

               /**
                * Get all crops from the database
                */
               CropsFactory.show(function(crops){
                   $scope.crops = crops;
               }, function(error){
                   $scope.crops = [];
               });
               /**
                * Get all suppliers from the database
                */
               SuppliersFactory.show(function(suppliers){
                   $scope.suppliers = suppliers;
               }, function(error){
                   $scope.suppliers = [];
               });
               $scope.user_obj = {};
               $scope.crop_type = {};
               $scope.supplier = {};
               $scope.usertypes = ['Administrator', 'Call Representative'];
               /**
                * Used to toggle list of records.
                * @type {{user: boolean, croptype: boolean, supplier: boolean}}
                */
               $scope.hideList = { user: false, croptype: false, supplier: false};
               /**
                * Determines if form to create user must edit a record or create a new record.
                * @type {boolean}
                */
               $scope.editUser = false;
               $scope.editCrop = false;
               $scope.editSupplier = false;
               /**
                * Displays form specific to each entity i.e. user, crop or supplier.
                * @param entity
                */
               $scope.create = function(entity){
                   if(entity === 'user'){
                       $scope.newUser = !$scope.newUser;
                       $scope.user_obj = {};
                       $scope.hideList.user = !$scope.hideList.user;
                   }else if(entity === 'croptype'){
                       $scope.newCropType = !$scope.newCropType;
                       $scope.crop_type = {};
                       $scope.hideList.croptype = !$scope.hideList.croptype;
                   }else if(entity === 'supplier'){
                       $scope.newSupplier = !$scope.newSupplier;
                       $scope.supplier = {};
                       $scope.hideList.supplier = !$scope.hideList.supplier;
                   }
               };
               /**
                * Closes form once user clicks the cancel button.
                *
                * @param entity
                */
               $scope.cancel = function(entity){
                   if(entity === 'user'){
                       if($scope.editUser){
                           $scope.editUser = !$scope.editUser;
                       }else{
                           $scope.user_obj = {};
                           $scope.newUser = !$scope.newUser;
                       }
                       $scope.hideList.user = !$scope.hideList.user;
                   }else if(entity === 'croptype'){
                       if($scope.editCrop){
                           $scope.editCrop = !$scope.editCrop;
                       }else{
                           $scope.crop_type = {};
                           $scope.newCropType = !$scope.newCropType;
                       }
                       $scope.hideList.croptype = !$scope.hideList.croptype;
                   }else if(entity === 'supplier'){
                       if($scope.editSupplier){
                           $scope.editSupplier = !$scope.editSupplier;
                       }else{
                           $scope.supplier = {};
                           $scope.newSupplier = !$scope.newSupplier;
                       }
                       $scope.hideList.supplier = !$scope.hideList.supplier;
                   }
               };
               /**
                * Creates and saves an entity i.e. user or crop type
                *  @param entity
                *
                */
               $scope.save = function(entity){
                   if(entity === 'user'){
                       UserProfileFactory.create($scope.user_obj, function(success){
                           $scope.user_obj = {};
                           $scope.newUser = !$scope.newUser;
                           showDialog($mdDialog, {statusText:" New User Created!"}, false);
                           getUsers();
                       }, function(error){
                           showDialog($mdDialog, error, false);
                       });
                       $scope.hideList.user = !$scope.hideList.user;
                   }else if(entity === 'croptype'){
                       CropFactory.create($scope.crop_type, function(success){
                           $scope.crop_type = {};
                           $scope.newCropType = !$scope.newCropType;
                           showDialog($mdDialog, {statusText:" New Crop Created!"}, false);
                       }, function(error){
                           showDialog($mdDialog, error, false);
                       });
                       $scope.hideList.croptype = !$scope.hideList.croptype;
                   }else if(entity === 'supplier'){
                       SupplierFactory.create($scope.supplier, function(success){
                           $scope.supplier = {};
                           $scope.newSupplier = !$scope.newSupplier;
                           showDialog($mdDialog,{statusText: "New Supplier Created!"}, false);
                       }, function(error){
                           showDialog($mdDialog, error, false);
                       });
                       $scope.hideList.supplier = !$scope.hideList.supplier;
                   }
               };
               /**
                * Gets the selected record from a list once clicked.
                * @param type - Type of record being selected.
                * @param obj - Details of record selected.
                */
               $scope.selectedElement = function(type, obj){
                   switch(type){
                       case 'user': $scope.editUser = !$scope.editUser;
                                    $scope.hideList.user = !$scope.hideList.user;
                                    $scope.user_obj = obj;
                           break;
                       case 'crop' : $scope.editCrop = !$scope.editCrop;
                                    $scope.hideList.croptype = !$scope.hideList.croptype;
                                    $scope.crop_type = obj;
                           break;
                       case 'supplier': $scope.editSupplier = !$scope.editSupplier;
                                        $scope.hideList.supplier = !$scope.hideList.supplier;
                                        $scope.supplier = obj;
                           break;
                       default: showDialog($mdDialog,{statusText: "Error"}, false);
                           break
                   }
               };
               /**
                *  Determines which type of selected record should be updated.
                * @param type - Type of record being selected.
                */
               $scope.update = function(type){
                  if(type === 'user'){
                      updateUser();
                  }else if(type === 'crop'){
                      updateCrop();
                  }else if(type === 'supplier'){
                      updateSupplier();
                  }
               };
               /**
                * Updates a user record. Requires admin privileges.
                */
               function updateUser(){
                   UserFactory.update({id:$scope.user_obj._id}, $scope.user_obj, function(success){
                       showDialog($mdDialog, {statusText: 'User Updated!'}, false);
                   }, function(error){
                       showDialog($mdDialog,error,false);
                   });
                   $scope.editUser = !$scope.editUser;
                   $scope.hideList.user = !$scope.hideList.user;
               }
               /**
                * Update a crop type record. Requires admin privileges.
                */
               function updateCrop(){
                    CropFactory.update({id:$scope.crop_type._id}, $scope.crop_type, function(success){
                        showDialog($mdDialog, {statusText: 'Crop Type Updated!'}, false);
                       }, function(error){
                        showDialog($mdDialog, error, false);
                    });
                   $scope.editCrop = !$scope.editCrop;
                   $scope.hideList.croptype = !$scope.hideList.croptype;
               }

               /**
                * Updates a supplier record. Requires admin privileges.
                */
               function updateSupplier(){
                  SupplierFactory.update({id:$scope.supplier._id}, $scope.supplier, function(success){
                       showDialog($mdDialog, {statusText: 'Supplier Updated!'}, false);
                   }, function(error){
                       showDialog($mdDialog, error, false);
                   });
                   $scope.editSupplier = !$scope.editSupplier;
                   $scope.hideList.supplier = !$scope.hideList.supplier;
               }
           }
            /**
             * End of Admin Functions
             */
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
