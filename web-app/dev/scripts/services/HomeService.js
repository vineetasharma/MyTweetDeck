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
                .error(function (error) {
                    console.log("error during retweet: ", error.message);
                    callback(error);
                });
        };
        this.makeFavourite = function (tweet,callback) {
            $http.post('/favouriteTweet',{tweet:tweet})
                .error(function (error) {
                    console.log("error during retweet: ", error.message);
                    callback(error);
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
    }]);