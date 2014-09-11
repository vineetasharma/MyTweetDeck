angular.module('yoApp')
    .service('ProfileService', ['$http', function ($http) {
        this.getProfile = function (callback) {
    $http.get("/getProfileData")
        .success(function (data) {
            console.log('user profile',data);
            callback(data);
        }).
        error(function (error) {
            console.log("error during finding profile data: ", error.message);
            callback(error);
        });
};
    }]);