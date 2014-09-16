angular.module('yoApp')
    .service('ContactService', ['$http', function ($http) {
        this.isValidEmail = function (email, callback) {
            // First check if any value was actually set
            if (email.length == 0) callback(false);
            // Now validate the email format using Regex
            else {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
                callback(re.test(email));

            }

        };

        this.sendMail = function (mailData, callback) {
            $http.post("/sendMail", mailData)
                .success(function (data) {
                    callback(data);
                }).
                error(function (error) {
                    log.error("error during sending mail: ", error);
                    callback(null);
                });

        }
    }]);
