var gulp       = require('gulp');
var clean      = require('gulp-clean');
var concat     = require('gulp-concat');
var jshint     = require('gulp-jshint');
var minify     = require('gulp-minify-css');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var react      = require('gulp-react');
var rename     = require('gulp-rename');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var wrap       = require('gulp-wrap');

// Load the configuration
var config = require('./gulp_config.js');
var path   = require('./gulp_path.js');

// Default tasks
gulp.task('default', ['copy', 'watch', 'build']);

gulp.task('clean', function() {
    // Clean the dist folder
    return gulp.src(config.DIST, { read: false })
        .pipe(clean({force: true}));
});

gulp.task('copy', ['clean'], function() {
    // Copy libs
    gulp.src(path.LIBS_ALL)
        // Copy all libs files in LIBS_DIST
        .pipe(gulp.dest(path.LIBS_DIST));

    // Copy fonts
    return gulp.src(path.FONTS_ALL)
        // Copy all fonts files in FONTS_DIST
        .pipe(gulp.dest(path.FONTS_DIST));
});

gulp.task('sass', ['clean'], function () {

    var list = {};

    list[path.SASS_AWESOME_MASTER] = path.SASS_AWESOME_DIST;
    list[path.SASS_FLEX_MASTER]    = path.SASS_FLEX_DIST;
    list[path.SASS_WWW_MASTER]     = path.SASS_WWW_DIST;
    list[path.SASS_TEAM_MASTER]    = path.SASS_TEAM_DIST;
    list[path.SASS_IE8_MASTER]     = path.SASS_IE8_DIST;

    for(var src in list) {
        var dest = list[src];

        // Compile SASS Master file of TEAM
        gulp.src(src)
            // Source map init
            .pipe(sourcemaps.init())

            // Compile sass
            .pipe(sass())

            // Concat
            .pipe(concat(path.TMP_CSS_CONCAT_DIST))

            // Minify css
            .pipe(minify())

            // Rename in .min.js
            .pipe(rename(path.TMP_CSS_UGILFY_DIST))

            // Source map write
            .pipe(sourcemaps.write('.'))

            // Destination of sass file
            .pipe(gulp.dest(dest))

            .on('error', gutil.log);
    }
});

gulp.task('compile-jsx', ['clean'], function() {

    return gulp.src(path.JSX_ALL)
        // Source map init
        .pipe(sourcemaps.init())

        // Compile react
        .pipe(react())

        // Source map write
        .pipe(sourcemaps.write('.'))

        // Destination of templates
        .pipe(gulp.dest(path.JSX_DIST))

        .on('error', gutil.log);;
});

gulp.task('concat-uglify', ['clean', 'compile-jsx'], function() {

    var all = [].concat(path.SCRIPTS_ALL);

    all.push(path.JSX_DIST_ALL);

    // JSHint all scripts
    gulp.src(all)
        // JSHint
        .pipe(jshint())
        // Report all errors
        .pipe(jshint.reporter('default'));

    // Uglify all scripts
    gulp.src(all)

        // Source map init
        .pipe(sourcemaps.init())

        // Concat
        .pipe(concat(path.TMP_JS_CONCAT_DIST))

        // Wrap all the content in a function (avoid leaking)
        .pipe(wrap({ src: './wrapper.tpl'}))

        // Uglify
        .pipe(uglify({ mangle: { toplevel: true, wrap: true }}))

        // Rename in .min.js
        .pipe(rename(path.TMP_JS_UGILFY_DIST))

        // Source map write
        .pipe(sourcemaps.write('.'))

        // Destination of uglifying
        .pipe(gulp.dest(path.SCRIPTS_DIST))

        .on('error', gutil.log);
});

gulp.task('build', ['sass', 'concat-uglify']);

gulp.task('production', ['copy', 'build']);

gulp.task('watch', ['build'], function () {

    // Watch all files then compile them
    gulp.watch([
        path.SASS_ALL,
        path.JSX_ALL,
        path.SCRIPTS_ALL
    ], ['copy', 'build'])

        .on('change', function(evt) {

            gutil.log('File changed:', evt.path);
        });
});
