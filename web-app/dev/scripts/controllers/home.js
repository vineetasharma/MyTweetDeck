'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('HomeCtrl',['$scope', '$window','HomeService','ProfileService', function ($scope,$window,HomeService,ProfileService) {
        $scope.signIn = function () {
            jQuery('#signin').modal({
                keyboard: true
            });
        };
        ProfileService.getProfile(function(err,data){
            if(data){
                $scope.profile=data;
                console.log(data);
            }
            else {
                $window.location.href = '#/';
            }
        });

        $scope.tweet=function(){
            if($scope.tweetStatus){
                console.log('status',$scope.tweetStatus);
                HomeService.tweet($scope.tweetStatus,function(err,data){
                    if(data){
                        $scope.tweets.push($scope.tweetStatus);
                    }
                });
            }
        }
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
        });
        (function(){
            setInterval(function(){ HomeService.getTweets(function(user_timeline_tweets){
                console.log('service called');
                $scope.tweets=user_timeline_tweets;
                console.log(user_timeline_tweets);
            });}, 10000);
        })();

    }]);