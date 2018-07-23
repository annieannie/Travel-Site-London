var gulp =  require('gulp');
var sass = require ('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**',
  imgSource: 'src/img/**'
};
var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
};

gulp.task('clean-html', function(){
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
  .pipe(clean());
});

gulp.task('clean-scripts', function(){
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
  .pipe(clean());
});

gulp.task('sass', function () {
  var bootStrapCss = gulp.src('./node_modules/bootStrap/dist/css/bootstrap.css');
  var sassFiles = gulp.src(SOURCEPATHS.sassSource)
  .pipe(autoprefixer())
  .pipe(sass({outputstyle: 'expanded'}).on('error', sass.logError))
  return merge(sassFiles, bootStrapCss)
    .pipe(concat( 'app.css'))
    .pipe(gulp.dest(APPPATH.css));
});

gulp.task('images', function () {
  return gulp.src(SOURCEPATHS.imgSource)
  .pipe(newer(APPPATH.img))
  .pipe(imagemin())
  .pipe(gulp.dest(APPPATH.img));
});

gulp.task('moveFonts', function () {
  gulp.src('./node_modules/bootStrap/dist/fonts/*.{eot, svg, ttf, woff, woff2}')
  .pipe(gulp.dest('APPPATH.fonts'));
});

gulp.task('scripts',['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js));
});

gulp.task('copy', ['clean-html'], function () {
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPPATH.root));
});

gulp.task('serve', ['sass'], function () {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'clean-html', 'copy', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
