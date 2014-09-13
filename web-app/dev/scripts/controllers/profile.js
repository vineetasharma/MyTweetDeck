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
        $scope.getProfileData = function (userId) {
            if (userId) {
                HomeService.getProfileData(userId, function (userData) {

                    $scope.profilePicUrl=userData.profilePicUrl;

                    $scope.Name = userData.username ? userData.username : '';

                    $scope.Email = userData.email ? userData.email : '';

                    $scope.About = userData.About ? userData.About : '';

                    $scope.Birthday = userData.profileData.Birthday ? userData.profileData.Birthday : '';

                    $scope.Gender = userData.profileData.Gender ? userData.profileData.Gender : '';

                    $scope.Mobile = ''+(userData.profileData.Mobile ? userData.profileData.Mobile:'');

                    $scope.lastSearchedPlace = userData.lastSearchedLocation.fullName ? userData.lastSearchedLocation.fullName : '';

                    $scope.Hometown = userData.Address.Hometown ? userData.Address.Hometown : '';

                    $scope.City = userData.Address.City ? userData.Address.City : '';

                    $scope.State = userData.Address.State ? userData.Address.State : '';

                    $scope.Country = userData.Address.Country ? userData.Address.Country : '';

                    $scope.Pin = ''+(userData.Address.pin ? userData.Address.pin : '');

                });
            }
            else {
                $window.location.href = '#/home';
            }
        };

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
