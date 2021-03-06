var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('javascript', function () {
  return gulp.src('./src/datepicker.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {
  return gulp.src('./src/datepicker.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watcher', function () {
  gulp.watch('./src/datepicker.scss', ['sass']);
  gulp.watch('./src/datepicker.js', ['javascript']);
});

gulp.task('default', ['javascript', 'sass', 'watcher', 'css']);