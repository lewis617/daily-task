var gulp = require('gulp');
var rjs = require('requirejs');

var paths = {
  scripts: ['modules/**/*.js', 'modules/**/**/*.js','main.js']
};

gulp.task('build', function(cb){
  rjs.optimize({
    baseUrl: "./",
    mainConfigFile:"./main.js",
    name:'main',
    out:'./dist/build-main.js'
  }, function(buildResponse){
    // console.log('build response', buildResponse);
    cb();
  }, cb);
});
// Rerun the task when a file changes
gulp.task('watch', function() {
  var watcher = gulp.watch(paths.scripts, ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('default', ['build','watch']);