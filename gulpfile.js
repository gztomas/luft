var gulp = require('gulp');
var babel = require("gulp-babel");
var sourceMaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var scriptsSource = './src/*.js';

gulp.task('build', function() {
  return gulp.src(scriptsSource)
    .pipe(sourceMaps.init())
    .pipe(babel())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write("."))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(scriptsSource, ['scripts']);
});

gulp.task('default', ['build']);
gulp.task('dev', ['build', 'watch']);
