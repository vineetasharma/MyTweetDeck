'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('HomeCtrl', ['$scope', '$window', 'HomeService', 'ProfileService', function ($scope, $window, HomeService, ProfileService) {
        $scope.signIn = function () {
            jQuery('#signin').modal({
                keyboard: false
            });
        };
        $scope.favouriteTweets=[];
        ProfileService.getProfile(function (err, data) {
            if (data) {
                $scope.profile = data;
                console.log(data);
            }
            else {
                $window.location.href = '#/';
            }
        });

        $scope.tweet = function () {
            if ($scope.tweetStatus) {
                console.log('status', $scope.tweetStatus);
                HomeService.tweet($scope.tweetStatus, function (err, data) {
                    if (data) {
                        $scope.tweets.push($scope.tweetStatus);
                    }
                });
            }
        }
        console.log('home controller called');
        HomeService.getTweets(function (user_timeline_tweets) {
            console.log('service called');
            $scope.tweets = user_timeline_tweets;
            console.log(user_timeline_tweets);
        });
        $scope.retweet = function (id) {
            console.log('retweet method called');
            console.log(id);
            HomeService.reTweet(id, function (data) {
                console.log(data,'data in retweet method');
                if (data) {
                    console.log('retweet successfully...');
                    $scope.tweets.forEach(function(tweet){
                        if(tweet.id_str==id)
                        tweet.retweeted=true;
                    });

                }
            })
        }
        $scope.favourite = function (fav_tweet) {
            HomeService.makeFavourite(fav_tweet, function (data) {
                if (data) {
                    console.log(data);
                    $scope.tweets.forEach(function(tweet){
                        if(tweet.id_str==fav_tweet.id_str)
                            tweet.favorited=true;
                    });
//                    if($scope.favouriteTweets){
                        $scope.favouriteTweets.push(data);
                        console.log('favourite tweet updated ',fav_tweet,'favourite Tweet',$scope.favouriteTweets);
//                    }
                }
            })
        }
        HomeService.getFavoriteTweets(function (tweets) {
            $scope.favouriteTweets = tweets;
        });
        (function () {
            setInterval(function () {
                HomeService.getTweets(function (user_timeline_tweets) {
                    console.log('service called');
                    if(typeof user_timeline_tweets=='object') $scope.tweets = user_timeline_tweets;
                    console.log(user_timeline_tweets);
                });
            }, 60000);
        })();

    }]);