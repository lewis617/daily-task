"use strict";
define([
    '../app',
    'text!./confirm.html'
], function (app,confirm_html) {
    app.factory('$confirm',['$uibModal',function($uibModal){
        return{
            open:function(callback){
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: confirm_html,
                    controller: 'ModalInstanceCtrl'
                });

                modalInstance.result.then(function () {
                    callback.call();
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        }

    }]);

    app.controller('ModalInstanceCtrl', ['$scope','$uibModalInstance',function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});