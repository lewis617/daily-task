'use strict';
define([],function(){

  // Declare app level module which depends on filters, and services
  return angular.module('myApp.config', [])

    // where to redirect users if they need to authenticate (see security.js)
      .constant('loginRedirectPath', '/login')

    // your Firebase data URL goes here, no trailing slash
      .constant('WDURL', "https://daily-task.wilddogio.com")

});
