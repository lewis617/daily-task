define(['require'],function () {
    return{
        registerConfig: function (app) {
            app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function($controllerProvider, $compileProvider, $filterProvider, $provide) {
                app.register = {
                    controller: $controllerProvider.register,
                    directive: $compileProvider.directive,
                    filter: $filterProvider.register,
                    factory: $provide.factory,
                    service: $provide.service
                };
            }]);
            return app;
        },
        load: function (dependencies) {
            return['$q','$rootScope',function($q, $rootScope) {
                    var deferred = $q.defer();
                    require(dependencies, function () {
                        $rootScope.$apply(function() {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }];


        }
    }
});