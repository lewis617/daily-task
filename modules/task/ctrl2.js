define(['./app'],function(app){
    app.register.controller('addTaskCtrl', ['$scope','$uibModalInstance',
        function($scope,$uibModalInstance) {
            $scope.options=['修改', '设计', '调研', '开发', '稳定','测试','生信', '编辑', '学习'];
            $scope.my_new_task={option:'修改'};

            $scope.ok = function (my_new_task,$addTaskForm) {
                if($addTaskForm.$invalid) {
                        if($addTaskForm.$error.required){
                            $scope.alerts.push({type:'danger',msg:'请将表单填写完整'});
                        }
                        else{
                            $scope.alerts.push({type:'danger',msg:'输入的数据类型不正确'});
                        }
                        return ;
                    }
                $uibModalInstance.close(my_new_task);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
});