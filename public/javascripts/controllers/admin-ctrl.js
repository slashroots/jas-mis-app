angular.module('jasmic.controllers')
    .controller('AdministratorCtrl', ['$scope','$mdDialog', '$mdToast', '$window','UsersFactory','CropsFactory','SuppliersFactory',
    'UserFactory','CropFactory','SupplierFactory', 'EmailFactory', 'UserProfileFactory', 'ParishesFactory',
    'UnitsFactory', 'UnitFactory',
    function($scope, $mdDialog, $mdToast, $window, UsersFactory, CropsFactory, SuppliersFactory, UserFactory, CropFactory,
    SupplierFactory, EmailFactory, UserProfileFactory, ParishesFactory, UnitsFactory, UnitFactory){
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
      getCrops = function(){
        CropsFactory.show(function(crops){
            $scope.crops = crops;
        },function(error){
            $scope.crops = [];
        });
      };
      getCrops();
      /**
       * Get all suppliers from the database
       */
      getSuppliers = function(){
          SuppliersFactory.show(function(suppliers){
            $scope.suppliers = suppliers;
        },function(error){
            $scope.suppliers = [];
        });
      };
      getSuppliers();
      /**
       * Get all parishes from the database
       */
      getParishes = function(){
        ParishesFactory.query({}, function(parishes){
            $scope.parishes = parishes;
        }, function(error){
            $scope.parishes = [];
        });
      }
      getParishes();
      /**
       * Get all units from the database.
       */
      getUnits = function(){
        UnitsFactory.query({}, function(units){
            $scope.units = units;
        }, function(error){
          $scope.units = [];
        });
      }
      getUnits();

      $scope.user_obj = {};
      $scope.crop_type = {};
      $scope.supplier = {};
      $scope.unit = {};
      $scope.usertypes = ['Administrator', 'Call Representative'];
      $scope.states = ['Approved', 'Pending'];
      /**
       * Used to toggle list of records.
       * @type {{user: boolean, croptype: boolean, supplier: boolean}}
       */
      $scope.hideList = { user: false, croptype: false, supplier: false, unit: false};
      /**
       * Determines if form to create user must edit a record or create a new record.
       * @type {boolean}
       */
      $scope.edit = { user : false, crop : false, supplier : false, unit: false };
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
          }else if(entity === 'unit'){
            $scope.newUnit = !$scope.newUnit;
            $scope.unit = {};
            $scope.hideList.unit = !$scope.hideList.unit;
          }
      };
      /**
       * Closes form once user clicks the cancel button.
       *
       * @param entity
       */
      $scope.cancel = function(entity){
          if(entity === 'user'){
              if($scope.edit.user){
                  $scope.edit.user = !$scope.edit.user;

              }else{
                  $scope.user_obj = {};
                  $scope.newUser = !$scope.newUser;
              }
              getUsers();
              $scope.hideList.user = !$scope.hideList.user;
          }else if(entity === 'croptype'){
              if($scope.edit.crop){
                  $scope.edit.crop = !$scope.edit.crop;
              }else{
                  $scope.crop_type = {};
                  $scope.newCropType = !$scope.newCropType;
              }
              getCrops();
              $scope.hideList.croptype = !$scope.hideList.croptype;
          }else if(entity === 'supplier'){
              if($scope.edit.supplier){
                  $scope.edit.supplier = !$scope.edit.supplier;
              }else{
                  $scope.supplier = {};
                  $scope.newSupplier = !$scope.newSupplier;
              }
              getSuppliers();
              $scope.hideList.supplier = !$scope.hideList.supplier;
          }else if(entity === 'unit'){
            if($scope.edit.unit){
              $scope.edit.unit = !$scope.edit.unit;
            }else{
              $scope.unit = {};
              $scope.newUnit = !$scope.newUnit;
            }
            getUnits();
            $scope.hideList.unit = !$scope.hideList.unit;
          }
      };
      /**
       * Creates and saves an entity i.e. user or crop type
       *  @param entity
       *
       */
      $scope.save = function(entity){
          if(entity === 'user'){
              UserProfileFactory.create($scope.user_obj, function(user){
                  $scope.newUser = !$scope.newUser;
                  showDialog($mdDialog, {statusText:" New User Created!"}, false);
              }, function(error){
                  showDialog($mdDialog, error, false);
              });
              EmailFactory.create({to:$scope.user_obj.us_email_address, email_type: "new_user_approval"}, function(success){
                $mdToast.show($mdToast.simple().position('bottom').content('Approval Email sent successfully.'));
              }, function(error){
                $mdToast.show($mdToast.simple().position('bottom').content('An error has occured in sending approval email.'));
              })
              $scope.user_obj = {};
              $scope.hideList.user = !$scope.hideList.user;
              getUsers();
          }else if(entity === 'croptype'){
              CropFactory.create($scope.crop_type, function(success){
                  $scope.crop_type = {};
                  $scope.newCropType = !$scope.newCropType;
                  showDialog($mdDialog, {statusText:" New Crop Created!"}, false);
              }, function(error){
                  showDialog($mdDialog, error, false);
              });
              $scope.hideList.croptype = !$scope.hideList.croptype;
              getCrops();
          }else if(entity === 'supplier'){
              SupplierFactory.create($scope.supplier, function(success){
                  $scope.supplier = {};
                  $scope.newSupplier = !$scope.newSupplier;
                  showDialog($mdDialog,{statusText: "New Supplier Created!"}, false);
              }, function(error){
                  showDialog($mdDialog, error, false);
              });
              $scope.hideList.supplier = !$scope.hideList.supplier;
              getSuppliers();
          }else if(entity === 'unit'){
            UnitFactory.create($scope.unit, function(success){
              $scope.unit = {};
              $scope.newUnit = !$scope.newUnit;
              showDialog($mdDialog,{statusText: "New Unit Created!"}, false);
            }, function(error){
              showDialog($mdDialog,error, false);
            });
            $scope.hideList.unit = !$scope.hideList.unit;
            getUnits();
          }
      };
      /**
       * Gets the selected record from a list once clicked.
       * @param type - Type of record being selected.
       * @param obj - Details of record selected.
       */
      $scope.selectedElement = function(type, obj){
          switch(type){
              case 'user': $scope.edit.user = !$scope.edit.user;
                           $scope.hideList.user = !$scope.hideList.user;
                           $scope.user_obj = obj;
                  break;
              case 'crop' : $scope.edit.crop = !$scope.edit.crop;
                           $scope.hideList.croptype = !$scope.hideList.croptype;
                           $scope.crop_type = obj;
                  break;
              case 'supplier': $scope.edit.crop = !$scope.edit.crop;
                               $scope.hideList.supplier = !$scope.hideList.supplier;
                               $scope.supplier = obj;
                  break;
              case 'unit' : $scope.edit.unit = !$scope.edit.unit;
                            $scope.hideList.unit = !$scope.hideList.unit;
                            $scope.unit = obj;
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
         }else if(type = 'unit'){
           updateUnit();
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
          EmailFactory.create({to:$scope.user_obj.us_email_address, email_type: "new_user_approval"}, function(success){
            $mdToast.show($mdToast.simple().position('bottom').content('Approval email sent successfully.'));
          }, function(error){
            $mdToast.show($mdToast.simple().position('bottom').content('An error has occured in sending approval email.'));
          })
          $scope.edit.user = !$scope.edit.user;
          $scope.hideList.user = !$scope.hideList.user;
          getUsers();
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
          $scope.edit.crop = !$scope.edit.crop;
          $scope.hideList.croptype = !$scope.hideList.croptype;
          getCrops();
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
          $scope.edit.supplier = !$scope.edit.supplier;
          $scope.hideList.supplier = !$scope.hideList.supplier;
          getSuppliers();
      }
      /**
       * Updates a unit by a supplied id.
       */
      function updateUnit(){
        UnitFactory.update({id: $scope.unit._id}, $scope.unit, function(success){
          $window.scrollTo(0,0);
          showDialog($mdDialog, {statusText: 'Unit Updated!'}, false);
        }, function(error){
          showDialog($mdDialog, error, false);
        });
        $scope.edit.unit = !$scope.edit.unit;
        $scope.hideList.unit = !$scope.hideList.unit;
        getUnits();
      }
}]);

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
