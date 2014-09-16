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
        $scope.genders=['Female','Male'];

        $scope.data={};
//        $scope.data.Gender=$scope.genders[0];
        $scope.editProfile=function(){
            $scope.edit=true;
        }
        $scope.cancel=function(){
            $scope.edit=false;
            $window.location.href = '#/profile';
        }
        $scope.resetEmail=function(){
            var reset=true;
            ProfileService.resetEmail(reset,function(err,data){
                if(err){
                    console.log('error when resetting email',err);
                }
                else{
                    console.log('email reset successfully ');
                }
            });

        }

        ProfileService.getProfile(function (err,data) {
            console.log(data,'data');
            if(data){
                $scope.profile = data;
                $scope.data.Name=$scope.profile.username;
                $scope.data.Gender=$scope.profile.profileData ? ($scope.profile.profileData.Gender ? $scope.profile.profileData.Gender : 'Female') : 'Female';
                $scope.data.City=$scope.profile.profileData ? ($scope.profile.profileData.Address ? $scope.profile.profileData.Address.City : '') : '';
                $scope.data.State=$scope.profile.profileData ? ($scope.profile.profileData.Address ? $scope.profile.profileData.Address.State : '') : '';
                $scope.data.HomeTown=$scope.profile.profileData ? ($scope.profile.profileData.Address ? $scope.profile.profileData.Address.Hometown : '') : '';
                $scope.data.Country=$scope.profile.profileData ? ($scope.profile.profileData.Address ? $scope.profile.profileData.Address.Country : '') : '';
                $scope.data.Pin=$scope.profile.profileData ? ($scope.profile.profileData.Address ? $scope.profile.profileData.Address.pin : '') : '';
                $scope.data.Mobile=''+$scope.profile.profileData ? $scope.profile.profileData.Mobile : '';
                $scope.data.Birthday=$scope.profile.profileData ? $scope.profile.profileData.Birthday : '';
                $scope.data.Email=$scope.profile.email? $scope.profile.email.emailId : '';
                console.log($scope.data.Gender,'gender');
                if(data.email)
                {

                }
            }
            else
            {
                $window.location.href = '#/';
            }
        });

        $scope.updateProfile=function(data){
            console.log('updated profile data',data,'Gender:',data.Gender);
            ProfileService.updateProfileData(data,function(err){
                if(!err){
                   // $scope.varifyEmail=true;

                    ProfileService.getProfile(function (err,data) {
                        console.log(data,'data');
                        if(data){
                            $scope.profile = data;
                            $scope.edit=false;
                            $window.location.href = '#/profile';
                        }
                        else
                        {
                            $window.location.href = '#/';
                        }
                    });

                }
            });

        }
}]);
