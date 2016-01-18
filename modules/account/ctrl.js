/**
 * Created by lewis on 15-10-16.
 */
define(['./app'],function(app){
    app.controller('AccountCtrl', ['$scope', 'Auth', 'wdutil', 'user', '$location', '$wilddogObject',
        function($scope, Auth, wdutil, user, $location, $wilddogObject) {
            var unbind;
            // create a 3-way binding with the user profile object in Firebase
            var profile = $wilddogObject(wdutil.ref('users', user.uid));
            profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

            // expose logout function to scope
            $scope.logout = function() {
                if( unbind ) { unbind(); }
                profile.$destroy();
                Auth.$unauth();
                $location.path('/login');
            };

            $scope.changePassword = function(pass, confirm, newPass,$changePassForm) {
                if($changePassForm.$invalid) {
                    if($changePassForm.$error.required){
                        $scope.alerts.push({type:'danger',msg:'请将表单填写完整'});
                    }
                    else{
                        $scope.alerts.push({type:'danger',msg:'输入的数据类型不正确'});
                    }
                    return;
                }
                else if( newPass !== confirm ) {
                    changePassForm.newPass.setCustomValidity('两次输入的密码不一致！');
                    $scope.alerts.push({type:'danger',msg:'两次输入的密码不一致'});
                    return;
                }
                else {
                    changePassForm.newPass.setCustomValidity('');
                    $scope.wait.show=true;
                    Auth.$changePassword({email: profile.email, oldPassword: pass, newPassword: newPass})
                        .then(function() {
                            $scope.wait.show=false;
                            $scope.alerts.push({type:'success',msg:'密码修改成功'});
                        }, function(err) {
                            $scope.wait.show=false;
                            $scope.alerts.push({type:'danger',msg:wdutil.errMessage(err)});
                        })
                }
            };

            $scope.changeEmail = function(pass, newEmail,$changeEmailForm) {
                if($changeEmailForm.$invalid) {
                    if($changeEmailForm.$error.required){
                        $scope.alerts.push({type:'danger',msg:'请将表单填写完整'});
                    }
                    else{
                        $scope.alerts.push({type:'danger',msg:'输入的数据类型不正确'});
                    }
                    return;
                }
                var oldEmail = profile.email;
                $scope.wait.show=true;
                Auth.$changeEmail({oldEmail: oldEmail, newEmail: newEmail, password: pass})
                    .then(function() {
                        // store the new email address in the user's profile
                        return wdutil.handler(function(done) {
                            wdutil.ref('users', user.uid, 'email').set(newEmail, done);
                        });
                    })
                    .then(function() {
                        $scope.wait.show=false;
                        $scope.alerts.push({type:'success',msg:'邮箱修改成功'});
                    }, function(err) {
                        $scope.wait.show=false;
                        $scope.alerts.push({type:'danger',msg:wdutil.errMessage(err)});
                    });
            };
        }
    ]);
});