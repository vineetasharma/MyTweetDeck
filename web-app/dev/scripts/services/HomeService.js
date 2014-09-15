angular.module('yoApp')
    .service('HomeService', ['$http', function ($http) {
        this.getTweets = function (callback) {
            $http.get('/getTweets')
                .success(function (data) {
                    console.log('user Tweets',data);
                    callback(data);
                }).
                error(function (error) {
                    console.log("error during finding tweets: ", error.message);
                    callback(error);
                });
        };
        this.reTweet = function (id,callback) {
            $http.post('/reTweet',{id:id})
                .success(function (data) {
                    console.log('Tweet retweeted',data);
                    callback('success');
                })
                .error(function (error) {
                    console.log("error during retweet: ", error.message);
                    callback(null);
                });
        };
        this.makeFavourite = function (tweet,callback) {
            $http.post('/favouriteTweet',{tweet:tweet})
                .success(function (data) {
                    console.log('Tweet favorited',data);
                    callback(data);
                })
                .error(function (error) {
                    console.log("error during favourite tweet: ", error.message);
                    callback(null);
                });
        };
        this.getFavoriteTweets = function (callback) {
            $http.get('/getfavouriteTweets')
                .success(function (data) {
                    console.log('user Favourite Tweets',data);
                    callback(data);
                })
                .error(function (error) {
                    console.log("error in finding Favourite tweets: ", error.message);
                    callback(error);
                });
        };
        this.tweet=function(status){
            $http.post('/makeTweet',{tweet:status})
                .error(function (error) {
                    console.log("error during retweet: ", error.message);
                    callback(error,null);
                });

        };
    }]);