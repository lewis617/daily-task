'use strict';
require.config({
    baseUrl:'',
    paths: {
        'angular': 'bower_components/angular/angular',
        'wilddog':'https://dn-liuyiqi.qbox.me/wilddog',
        'wildAngular':'bower_components/wild-angular/dist/wild-angular.min',
        'ngRoute':'bower_components/angular-route/angular-route.min',
        'domReady':'bower_components/domReady/domReady',
        'text':'bower_components/text/text',
        'ui-bootstrap' : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-animate':'bower_components/angular-animate/angular-animate.min',


        'routeConfig':'components/routeConfig'
    },
    map: { '*': { 'css': 'bower_components/require-css/css.min' } } ,
    shim: {
        'angular' : {'exports' : 'angular'},
        'wildAngular':['wilddog','angular'],
        'ngRoute':['angular'],
        'ui-bootstrap': ['angular','css!bower_components/bootstrap/dist/css/bootstrap.min'],
        'angular-animate':['angular']
    }
});

require([
    'domReady!',
    'modules/home/main',
    'modules/login/main',
    'modules/account/main',
    'modules/task/main'
],function(){
    angular.module("myApp", [
        "myApp.home",
        "myApp.login",
        "myApp.account",
        'myApp.task'
    ]).run(['$rootScope', 'Auth', function($rootScope, Auth) {
            // track status of authentication
            Auth.$onAuth(function(user) {
                $rootScope.loggedIn = !!user;
            });

            //alert列表以及关闭方法
            $rootScope.alerts = [];
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

        }]);


    angular.bootstrap(document,['myApp']);
});

