'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('ProfileCtrl', ['$scope', 'ProfileService','$window', function ($scope, ProfileService,$window) {
        console.log('Profile controller called');
        $scope.editProfile=function(){
            $scope.edit=true;
        }
        $scope.cancel=function(){
            $scope.edit=false;
            $window.location.href = '#/profile';
        }

        ProfileService.getProfile(function (err,data) {
            console.log(data,'data');
            if(data){
                $scope.profile = data;
            }
            else
            {
                $window.location.href = '#/';
            }
        });

        $scope.updateProfile=function(data){
            ProfileService.updateProfileData(data,function(err){
                if(!err){
                    $scope.varifyEmail=true;
                }
            });

        }
}]);
