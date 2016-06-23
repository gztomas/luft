var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var scriptsSource = './src/*.js';

gulp.task('scripts', function() {
  return gulp.src(scriptsSource)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(scriptsSource, ['scripts']);
});

gulp.task('default', ['scripts']);
