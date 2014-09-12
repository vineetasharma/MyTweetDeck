'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('ProfileCtrl',['$scope','ProfileService', function ($scope,ProfileService) {
        console.log('Profile controller called');
        ProfileService.getProfile(function(data){
            if(data){
                $scope.profile=data;
                $scope.Name=data.username;
                $scope.Email=data.email.emailId;
                $scope.Gender=data.profileData.Gender;
                $scope.profilePicUrl=data.profilePicUrl;
                console.log('profile Url',$scope.profilePicUrl);
            }

            console.log(data,'user profile data in profile controller');
        });
    }]);
