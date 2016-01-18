define(['./app','routeConfig'],function(app,routeConfig){

    routeConfig.registerConfig(app);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.whenAuthenticated('/task', {
            templateUrl: 'modules/task/task.html',
            controller: 'TaskCtrl',
            resolve:{
                load:routeConfig.load(
                    [
                        'modules/task/ctrl2'
                    ]
                )
            }
        })
    }]);
});
