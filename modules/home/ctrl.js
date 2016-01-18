define(['./app'],function(app){
    app.controller('HomeCtrl',
        ['$scope', 'user', 'wdutil','$wilddogObject',
            function ($scope, user ,wdutil, $wilddogObject) {
                if(!user)return;
                var unbind;
                // create a 3-way binding with the user profile object in Firebase
                var profile = $wilddogObject(wdutil.ref('users',user.uid));
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
                $scope.profile={name:'亲爱的用户',email:'user@user.com'}
            }]);
});