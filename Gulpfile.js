var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    minify     = require('gulp-minify-css'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename     = require('gulp-rename'),
    gutil      = require('gulp-util'),
    pathlib    = require('path'),
    glob       = require('glob');

// Load the configuration
var config = require('./gulp_config.js');
var path   = require('./gulp_path.js');

// Default tasks
gulp.task('default', ['copy', 'watch', 'sass']);

gulp.task('copy', function() {

    // Copy fonts
    return gulp.src(path.FONTS_ALL)
        // Copy all fonts files in FONTS_DIST
        .pipe(gulp.dest(path.FONTS_DIST));
});

gulp.task('sass', function () {

    var list = {};

    list[path.SASS_WWW_MASTER]  = path.SASS_WWW_DIST;
    list[path.SASS_TEAM_MASTER] = path.SASS_TEAM_DIST;
    list[path.SASS_IE8_MASTER]  = path.SASS_IE8_DIST;
    list[path.SASS_MAIL_MASTER] = path.SASS_MAIL_DIST;

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

            // Rename in .min.css
            .pipe(rename(path.TMP_CSS_UGILFY_DIST))

            // Source map write
            .pipe(sourcemaps.write('.'))

            // Destination of sass file
            .pipe(gulp.dest(dest))

            .on('error', gutil.log);
    }

    var apps = glob.sync('./resources/sass/apps/*').map(function(appDir) {
        return pathlib.basename(appDir);
    });

    apps.forEach(function(app) {
        // Compile SASS Master file of TEAM
        gulp.src('./resources/sass/apps/' + app + '/master.scss')
            // Source map init
            .pipe(sourcemaps.init())

            // Compile sass
            .pipe(sass())

            // Concat
            .pipe(concat(path.TMP_CSS_CONCAT_DIST))

            // Minify css
            .pipe(minify())

            // Rename in .min.css
            .pipe(rename('app-' + app + '.min.css'))

            // Source map write
            .pipe(sourcemaps.write('.'))

            // Destination of sass file
            .pipe(gulp.dest(path.SASS_APPS_DIST))

            .on('error', gutil.log);
    });

    return gulp;
});

gulp.task('build', ['copy', 'sass']);

gulp.task('watch', ['sass'], function () {

    // Watch all files then compile them
    gulp.watch([
        path.SASS_ALL
    ], ['copy', 'sass'])

        .on('change', function(evt) {

            gutil.log('File changed:', evt.path);
        });
});
