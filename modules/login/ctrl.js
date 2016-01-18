define(['./app'],function(app){
    app.register.controller('LoginCtrl',
        ['$scope', 'Auth', '$location', 'wdutil',
            function($scope, Auth, $location, wdutil) {
                $scope.email = null;
                $scope.pass = null;
                $scope.confirm = null;
                $scope.createMode = false;
                $scope.login = function(email, pass) {
                    if(!assertValidAccountProps() ) return;
                    $scope.wait.show=true;
                    Auth.$authWithPassword({ email: email, password: pass }, {rememberMe: true})
                        .then(function(/* user */) {
                            $scope.wait.show=false;
                            $scope.alerts.push({type:'success',msg:  '登录成功！'});
                            $location.path('/task');
                        }, function(err) {
                            $scope.wait.show=false;
                            $scope.alerts.push({type:'danger',msg:wdutil.errMessage(err)});
                        });
                };

                $scope.createAccount = function() {
                    if( !assertValidAccountProps() ) return;
                    var email = $scope.email;
                    var pass = $scope.pass;
                    // create user credentials in Firebase auth system
                    $scope.wait.show=true;
                    Auth.$createUser({email: email, password: pass})
                        .then(function() {
                            // authenticate so we have permission to write to Firebase
                            return Auth.$authWithPassword({ email: email, password: pass });
                        })
                        .then(function(user) {
                            // create a user profile in our data store
                            var ref = wdutil.ref('users', user.uid);
                            return wdutil.handler(function(cb) {
                                ref.set({email: email, name: $scope.name||firstPartOfEmail(email)}, cb);
                            });
                        })
                        .then(function(/* user */) {
                            $scope.wait.show=false;
                            // redirect to the account page
                            $location.path('/account');
                        }, function(err) {
                            $scope.wait.show=false;
                            $scope.alerts.push({type:'danger',msg:wdutil.errMessage(err)});
                        });
                };



                function assertValidAccountProps() {
                    if(!$scope.loginForm.$valid){
                        if($scope.loginForm.$error.required){
                            $scope.alerts.push({type:'danger',msg:'请将表单填写完整'});
                        }
                        else{
                            $scope.alerts.push({type:'danger',msg:'输入的数据类型不正确'});
                        }
                        return false;
                    }
                    else if( $scope.createMode && $scope.pass != $scope.confirm){
                        loginForm.pass.setCustomValidity('两次输入的密码不一致');
                        $scope.alerts.push({type:'danger',msg:'两次输入的密码不一致'});
                        return false;
                    }
                    else{
                        loginForm.pass.setCustomValidity('');
                        return true;
                    }

                }

                function firstPartOfEmail(email) {
                    return ucfirst(email.substr(0, email.indexOf('@'))||'');
                }

                function ucfirst (str) {
                    // inspired by: http://kevin.vanzonneveld.net
                    str += '';
                    var f = str.charAt(0).toUpperCase();
                    return f + str.substr(1);
                }
            }]);
});