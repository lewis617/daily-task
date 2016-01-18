define(['../app','text!./wait.html'], function (app,waitTpl) {
    app.directive('wait', function() {
        return {
            restrict: 'AE',
            template:waitTpl,
            link:function(scope,element,attrs){
                scope.$root.wait=[];
            }
        }
    });
});