const gulp = require('gulp');

const base64 = require('gulp-css-base64');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('js', () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('scss', () => {
  return gulp.src('./src/**/*.scss')
    .pipe(base64())
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.scss', ['scss']);
  gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('build', ['js', 'scss']);
gulp.task('default', ['js', 'scss', 'watch']);
