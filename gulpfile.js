var gulp = require('gulp');
var sass = require('gulp-sass');
var indent = require('gulp-indent');
var htmlhint = require('gulp-htmlhint');
var scsslint = require('gulp-scss-lint');
var phplint  = require('gulp-phplint');
var jshint   = require('gulp-jshint');
var cleancss = require('gulp-clean-css');
var minifyjs = require('gulp-minify');
var del = require('del');

gulp.task('default', () => {
    console.log('Hello, world!');
});

/**
 * SCSS→CSS
 */
gulp.task('sass', () => {
    gulp.src("src/**/*.scss", {base:'src'})
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest("dest"));
});

/**
 * Watch SCSS→CSS
 */
gulp.task('sass:watch', () => {
    gulp.watch("src/**/*.scss", ['sass']);
    
    //gulp.watch("src/**/*.scss", {base:'src'}, ['sass'], (e) => {
    //    console.log(e.path + 'が' + e.type);
    //    if(e.type === "deleted") del([e.path]);
    //});
});

/**
 * Format
 */
// 実装難しい...

/**
 * Lint HTML, SCSS
 */
gulp.task('lint', () => {
    gulp.src("src/**/*.html", {base:'src'})
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());

    gulp.src("src/**/*.scss", {base:'src'})
        .pipe(scsslint({
            'config': 'scss-lint.yml'
        }))
        .pipe(scsslint.failReporter());
});

/**
 * Lint PHP, JS
 */
gulp.task('lint-prg', () => {
    gulp.src("src/**/*.php", {base:'src'})
        .pipe(phplint())
        .pipe(phplint.reporter('fail'));

    gulp.src("src/**/*.js", {base:'src'})
        .pipe(jshint())
        .pipe(jshint.reporter());
});

/**
 * Minify JS
 */
gulp.task('mini', ['lint-prg'], () => {
    /*
    // SCSS→CSSの時点で圧縮出来るので、要らんかも
    gulp.src("src/*.css")
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest("dest"));
    */

    gulp.src("src/**/*.js", {base:'src'})
        .pipe(minifyjs({
            ext: {
                src: '-debug.js',
                min: '.js'
            }
        }))
        .pipe(gulp.dest("dest"));
});

/**
 * Clean dest
 */
gulp.task('clean', (cb) => {
    del(['dest/*'], cb);
});
