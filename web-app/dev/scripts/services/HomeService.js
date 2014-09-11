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
               /* .success(function (data) {
                    console.log('retweet successfully',data);
                    callback(data);
                }).*/
                .error(function (error) {
                    console.log("error during retweet: ", error.message);
                    callback(error);
                });
        };
    }]);