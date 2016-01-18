define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/login/login.html',
            resolve:{
                load:routeConfig.load(['modules/login/ctrl'])
            }
        });
    }])
});
