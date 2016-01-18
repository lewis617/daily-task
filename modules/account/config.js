/**
 * Created by lewis on 15-10-16.
 */
define(['./app'],function(app){
    app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.whenAuthenticated('/account', {
      templateUrl: 'modules/account/account.html',
      controller: 'AccountCtrl'
    })
  }]);
});
