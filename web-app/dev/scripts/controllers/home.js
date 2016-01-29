'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the yoApp
 */
(function (angular, Primus) {


    angular.module('yoApp')
        .controller('HomeCtrl', ['$scope', '$window', 'HomeService', 'ProfileService', function ($scope, $window, HomeService, ProfileService) {
            // connect to current URL
            var primus = Primus.connect();

            primus.on("open", function () {

                console.log("Connected!")
                emitMsj("START_STREAM");
            })
            function emitMsj(signal, o) {
                if(primus) {
                    primus.write(signal, o);
                }
                else {
                    alert("Shit! primus didn't start!");
                }
            }

            primus.on("tweet", function (tweet) {
                console.log(tweet)
                if ($scope.tweets) {
                    $scope.$apply(function () {
                        $scope.tweets[0]=tweet;
                       // $scope.tweets.push(tweet);
                    });
                }
            })
            $scope.signIn = function () {
                jQuery('#signin').modal({
                    keyboard: false
                });
            };
            $scope.showTweet = function () {
                jQuery('#tweet').modal({
                    keyboard: false
                });
            };
            $scope.showUser = function () {
                jQuery('#UserSearch').modal({
                    keyboard: false
                });
            };
            $scope.favouriteTweets = [];
            $scope.tweets = [];
            ProfileService.getProfile(function (err, data) {
                if (data) {
                    $scope.profile = data;
                    //console.log(data);
                }
                else {
                    $window.location.href = '#/';
                }
            });
            HomeService.getFriends(function (err, friends) {
                if (friends) {
                    $scope.friends = friends.users;
                }
                //console.log('friend list:', friends);

            });
            $scope.tweet = function () {
                if ($scope.tweetStatus) {
                    //console.log('status', $scope.tweetStatus);
                    HomeService.tweet($scope.tweetStatus, function (err, data) {
                        if (data) {
                            $scope.tweets.push($scope.tweetStatus);
                        }
                    });
                }
            }
            //console.log('home controller called');
            HomeService.getTweets(function (user_timeline_tweets) {
                //console.log('service called');
                if (typeof user_timeline_tweets == 'object') {
                    /*user_timeline_tweets.forEach(function (tweet) {
                     $scope.tweets.push(tweet);
                     });*/
                    $scope.tweets = user_timeline_tweets;
                    //console.log('tweets::::::::::::::::::::::::::::::',$scope.tweets);
                }
                //console.log(user_timeline_tweets);
            });
            $scope.retweet = function (id) {
                console.log('retweet method called');
                console.log(id);
                HomeService.reTweet(id, function (data) {
                    console.log(data, 'data in retweet method');
                    if (data) {
                        console.log('retweet successfully...');
                        $scope.tweets.forEach(function (tweet) {
                            if (tweet.id_str == id)
                                tweet.retweeted = true;
                        });

                    }
                })
            }
            $scope.unfollow = function (user) {
                console.log('unfollow method called');
                HomeService.unFollow({screen_name: user.screen_name, user_id: user.id}, function (data) {
                    if (data) {

                        console.log('unfollow request completed');
                    }
                })
            }
            $scope.follow = function (user) {
                console.log('follow method called');
                HomeService.follow({screen_name: user.screen_name, user_id: user.id}, function (data) {
                    if (data) {
                        console.log('follow request completed');

                    }
                })
            }
            $scope.favourite = function (fav_tweet) {
                HomeService.makeFavourite(fav_tweet, function (data) {
                    if (data) {
                        console.log(data);
                        $scope.tweets.forEach(function (tweet) {
                            if (tweet.id_str == fav_tweet.id_str) {
                                tweet.favorited = true;
                                $scope.favouriteTweets.push(data);
                            }

                        });
//                    if($scope.favouriteTweets){

                        console.log('favourite tweet updated ', fav_tweet, 'favourite Tweet', $scope.favouriteTweets);
//                    }
                    }
                })
            }
            HomeService.getFavoriteTweets(function (tweets) {
                $scope.favouriteTweets = tweets;
//            $scope.tweets = $scope.tweets.concat($scope.favouriteTweets);
            });
            (function () {
                setInterval(function () {
                    HomeService.getTweets(function (user_timeline_tweets) {
                        console.log(user_timeline_tweets, 'new tweets');
                        console.log('service called');
                        if (typeof user_timeline_tweets == 'object') {
                            var temp = [];
                            var flag = false;
                            $scope.tweets.forEach(function (tweet) {
                                user_timeline_tweets.forEach(function (newTweet) {
                                    if (tweet.id_str === newTweet.id_str) {
                                        flag = true;
                                    }
                                });
                                if (!flag) {
                                    temp.push(tweet);
                                }
                                console.log('outer part');
                                flag = false;
                            });
                            console.log('temp....', temp);
                            console.log('if part...');
                            temp.forEach(function (oldTweet) {
                                user_timeline_tweets.push(oldTweet);


                            });
                            console.log(user_timeline_tweets.length, ':length of user Time Line Tweets');
                            $scope.tweets = user_timeline_tweets;
                        }

                        console.log(user_timeline_tweets);
                    });
                }, 60000);
            })();
            $scope.searchTweet = function (text) {
                HomeService.getSearchTweets({text: text}, function (err, data) {
                    if (err) {
                        console.log('error while searching tweets');
                    }
                    else {
                        $scope.showTweet();
                        $scope.searchTweets = data.statuses;
                        console.log('search tweets:', data.statuses, 'total search tweets: ', data.statuses.length);
                    }
                });
            }
            $scope.searchUser = function (name) {
                HomeService.getSearchUsers({name: name}, function (err, users) {
                    if (err) {
                        console.log('error while searching user...');
                    }
                    else {
                        $scope.showUser();
                        $scope.users = users;
                        console.log('search results:', users);
                    }
                });
            }
            $scope.search = function (id, name) {
                if (arguments.length == 2) {
                    HomeService.getUserTimeLine({user_id: id, screen_name: name}, function (err, data) {
                        if (err) {
                            console.log('error while getting user time line tweets');
                        }
                        else {
                            console.log('user time line tweets:', data);
                            $scope.friendTimelines = data;
                        }
                    });
                }
                else if (id.user) {
                    console.log(id, ':selected value');
                    HomeService.getUserTimeLine({
                        user_id: id.user.id,
                        screen_name: id.user.screen_name
                    }, function (err, data) {
                        if (err) {
                            console.log('error while getting user time line tweets');
                        }
                        else {
                            console.log('user time line tweets:', data);
                            $scope.friendTimelines = data;
                        }
                    });
                }
                else {
                    HomeService.getUserTimeLine({user_id: id.id, screen_name: id.screen_name}, function (err, data) {
                        if (err) {
                            console.log('error while getting user time line tweets');
                        }
                        else {
                            console.log('user time line tweets:', data);
                            $scope.friendTimelines = data;
                        }
                    });
                }
            }
        }]);
})(window.angular, window.Primus)
