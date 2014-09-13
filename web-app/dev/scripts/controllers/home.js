'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('HomeCtrl',['$scope','HomeService', function ($scope,HomeService) {
        $scope.signIn = function () {
            jQuery('#signin').modal({
                keyboard: true
            });
        };
        console.log('home controller called');
        HomeService.getTweets(function(user_timeline_tweets){
            console.log('service called');
            $scope.tweets=user_timeline_tweets;
            console.log(user_timeline_tweets);
        });
        $scope.retweet=function(id){
            console.log('retweet method called');
            console.log(id);
            HomeService.reTweet(id,function(data){
                if(data){console.log('retweet successfully...');}
            })
        }
        $scope.favourite=function(tweet){
            HomeService.makeFavourite(tweet,function(data){
                if(data){
                    console.log(data);
                }
            })
        }
        HomeService.getFavoriteTweets(function(tweets){
            $scope.favouriteTweets=tweets;
        })
    }]);
