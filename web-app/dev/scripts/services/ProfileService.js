angular.module('yoApp')
    .service('ProfileService', ['$http', function ($http) {
        this.getProfile = function (callback) {
            $http.get("/getProfileData")
                .success(function (data) {
                    console.log('user profile', data);
                    callback(null, data);
                }).
                error(function (error) {
                    console.log("error during finding profile data: ", error.message);
                    callback(error, null);
                });
        };
        this.updateProfileData=function(data, callback)
        {
            $http.post("/updateProfile",data)
                .success(function (data) {
                    console.log('user\'s updated profile', data);
                    callback(null, data);
                })
                .error(function(error){
                   console.log('error while updating profile: ',error.message);
                    callback(error,null);
                });

        };
    }]);