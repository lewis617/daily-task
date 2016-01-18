
// a simple wrapper on wilddog and AngularFire to simplify deps and keep things DRY
define(['ngRoute','config'],function(){
    // when $routeProvider.whenAuthenticated() is called, the path is stored in this list
    // to be used by authRequired() in the services below
    var securedRoutes = [];
    angular.module('wilddog.utils', ['wilddog','ngRoute','myApp.config'])
        .factory('wdutil', ['$window', '$q','WDURL' ,function($window, $q,WDURL) {
            "use strict";

            var utils = {
                // convert a node or wilddog style callback to a future
                handler: function(fn, context) {
                    return utils.defer(function(def) {
                        fn.call(context, function(err, result) {
                            if( err !== null ) { def.reject(err); }
                            else { def.resolve(result); }
                        });
                    });
                },

                // abstract the process of creating a future/promise
                defer: function(fn, context) {
                    var def = $q.defer();
                    fn.call(context, def);
                    return def.promise;
                },

                ref: wilddogRef,

                errMessage:function (err) {
                    var errStr=angular.isObject(err) && err.code? err.code : err + '';
                    if(errStr=='invalid_password'||errStr=='invalid_credentials')errStr='密码错误';
                    if(errStr=='email_taken')errStr='该邮箱已存在';
                    if(errStr=='invalid_email')errStr='无效的邮箱';

                    return errStr;
                }
            };

            return utils;

            function pathRef(args) {
                for (var i = 0; i < args.length; i++) {
                    if (angular.isArray(args[i])) {
                        args[i] = pathRef(args[i]);
                    }
                    else if( typeof args[i] !== 'string' ) {
                        throw new Error('Argument '+i+' to wilddogRef is not a string: '+args[i]);
                    }
                }
                return args.join('/');
            }
            function wilddogRef(path) {
                var ref = new $window.Wilddog(WDURL);
                var args = Array.prototype.slice.call(arguments);
                if( args.length ) {
                    ref = ref.child(pathRef(args));
                }
                return ref;
            }
        }])



        .factory("Auth", ["$wilddogAuth","wdutil",
            function($wilddogAuth,wdutil) {
                return $wilddogAuth(wdutil.ref());
            }
        ])
    /**
     * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
     * when called, waits for auth status to be resolved asynchronously, and then fails/redirects
     * if the user is not properly authenticated.
     *
     * The promise either resolves to the authenticated user object and makes it available to
     * dependency injection (see AuthCtrl), or rejects the promise if user is not logged in,
     * forcing a redirect to the /login page
     */
        .config(['$routeProvider', function ($routeProvider) {
            // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
            // unfortunately, a decorator cannot be use here because they are not applied until after
            // the .config calls resolve, so they can't be used during route configuration, so we have
            // to hack it directly onto the $routeProvider object
            $routeProvider.whenAuthenticated = function (path, route) {
                securedRoutes.push(path); // store all secured routes for use with authRequired() below
                route.resolve = route.resolve || {};
                route.resolve.user = ['Auth', function (Auth) {
                    return Auth.$requireAuth();
                }];
                $routeProvider.when(path, route);
                return this;
            }
        }])

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
        .run(['$rootScope', '$location', 'Auth', 'loginRedirectPath',
            function ($rootScope, $location, Auth, loginRedirectPath) {
                // watch for login status changes and redirect if appropriate
                Auth.$onAuth(check);

                // some of our routes may reject resolve promises with the special {authRequired: true} error
                // this redirects to the login page whenever that is encountered
                $rootScope.$on("$routeChangeError", function (e, next, prev, err) {
                    if (err === "AUTH_REQUIRED") {
                        $location.path(loginRedirectPath);
                    }
                });

                function check(user) {
                    if (!user && authRequired($location.path())) {
                        console.log('check failed', user, $location.path()); //debug
                        $location.path(loginRedirectPath);
                    }
                }

                function authRequired(path) {
                    console.log('authRequired?', path, securedRoutes.indexOf(path)); //debug
                    return securedRoutes.indexOf(path) !== -1;
                }
            }
        ])


    /**
     * Wraps ng-cloak so that, instead of simply waiting for Angular to compile, it waits until
     * Auth resolves with the remote Firebase services.
     *
     * <code>
     *    <div ng-cloak>Authentication has resolved.</div>
     * </code>
     */
        .config(['$provide', function($provide) {
            // adapt ng-cloak to wait for auth before it does its magic
            $provide.decorator('ngCloakDirective', ['$delegate', 'Auth',
                function($delegate, Auth) {
                    var directive = $delegate[0];
                    // make a copy of the old directive
                    var _compile = directive.compile;
                    directive.compile = function(element, attr) {
                        Auth.$waitForAuth().then(function() {
                            // after auth, run the original ng-cloak directive
                            _compile.call(directive, element, attr);
                        });
                    };
                    // return the modified directive
                    return $delegate;
                }]);
        }]);
});


