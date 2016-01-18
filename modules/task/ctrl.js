define(['./app'],function(app){
    app.controller('TaskCtrl', ['$scope','wdutil', 'user', '$wilddogArray','$wilddogObject','$confirm','$uibModal',
        function($scope, wdutil, user,  $wilddogArray,$wilddogObject,$confirm,$uibModal) {
            var profile = $wilddogObject(wdutil.ref('users', user.uid));
            profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

            //加载任务
            $scope.wait.show=true;
            $scope.tasks = $wilddogArray(wdutil.ref('tasks'));
            $scope.tasks.$loaded(function () {
                $scope.wait.show=false;
            });

            //设置状态选择器
            $scope.statusArray=[{id:2,string:'全部'},{id:0,string:'未完成'},{id:1,string:'完成'}];
            //加载用户集合
            $scope.users=$wilddogArray(wdutil.ref('users'));
            $scope.users.$loaded(function(){
                $scope.users.unshift({name:'全部'});
                //设置默认过滤器
                $scope.filters={
                    user:$scope.users[0],
                    status:$scope.statusArray[0],
                    date:null
                };
                //过滤数据监视
                $scope.filterFunctions={
                    name:function(item){
                        if($scope.filters.user.name=='全部'||item.user==$scope.filters.user.name)return true;
                        return false;
                    },
                    status:function(item){
                        if($scope.filters.status.id==2||item.status==$scope.filters.status.id)return true;
                        return false;
                    },
                    date:function(item){
                        if($scope.filters.date==null||new Date(item.date).getDate()==$scope.filters.date.getDate())return true;
                        return false;
                    }
                };
            });







            //添加任务
            $scope.open = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'addTask.html',
                    controller:'addTaskCtrl'
                });

                modalInstance.result.then(function (my_new_task) {

                    $scope.tasks.$add({
                        detail: my_new_task,
                        user: profile.name,
                        date: new Date().getTime(),
                        status: 0
                    }).then(function () {
                        $scope.alerts.push({type: "success", msg: "添加任务成功"});
                        $scope.my_new_task={option:'修改'};
                    });

                });
            };

            //完成任务
            $scope.finishTask= function (id) {
                var ref=wdutil.ref('tasks',id);
                ref.update({status:1});
            };

            //重启任务
            $scope.restartTask=function(id){
                var ref=wdutil.ref('tasks',id);
                ref.update({status:0});
            };

            //删除任务
            $scope.deleteTask= function (id) {
                $confirm.open(function () {
                    var ref=wdutil.ref('tasks',id);
                    ref.remove();
                });
            };
        }
    ]);
});