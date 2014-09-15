function createAutoClosingAlert(selector, delay) {
    jQuery(selector).show();
    var alert = jQuery(selector).alert();
    window.setTimeout(function() { alert.hide() }, delay);
}
angular.module('yoApp')
    .controller('ContactCtrl', ['$scope', 'ContactService', function ($scope, ContactService) {
        jQuery(".alert-info").hide();
        jQuery(".alert-success").hide();
        jQuery(".alert-dismissable").hide();
        jQuery(".alert-error").hide();
        jQuery(".alert-warning").hide();

        $scope.sendMail = function () {
            $scope.disable = true;
            if ($scope.name && $scope.message && $scope.email) {
                ContactService.isValidEmail($scope.email, function (valid) {
                    if (!valid) {
                        createAutoClosingAlert(".alert-info", 3000);
                        $scope.email = '';
                        $scope.disable = false;

                    }
                    else {
                        var mailData = {
                            name: $scope.name,
                            email: $scope.email,
                            message: $scope.message
                        };
                        ContactService.sendMail(mailData, function (data) {

                            if (data) {
                                createAutoClosingAlert(".alert-success", 3000);
                                $scope.name = '';
                                $scope.email = '';
                                $scope.message = '';
                                $scope.disable = false;
                            }
                            else {
                                $scope.disable = false;
                                createAutoClosingAlert(".alert-error", 3000);
                            }
                        });

                    }
                });

            }
            else{
                $scope.disable = false;
                createAutoClosingAlert(".alert-warning", 3000);
            }

        }


    }]);

