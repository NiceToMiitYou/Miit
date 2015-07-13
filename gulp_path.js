
var config = require('./gulp_config.js');

module.exports = {

    // Temp files
    TMP_CSS_CONCAT_DIST: 'master.concat.css',
    TMP_CSS_UGILFY_DIST: 'master.min.css',

    // Fonts files
    FONTS_ALL: [
        config.RESOURCES + 'fonts/**/*.*'
    ],
    FONTS_DIST:          config.DIST + 'fonts/',

    // Sass files
    SASS_ALL: [
        config.RESOURCES + 'sass/**/*.scss',
    ],
    SASS_AWESOME_MASTER: config.RESOURCES + 'sass/font-awesome/font-awesome.scss',
    SASS_FLEX_MASTER:    config.RESOURCES + 'sass/flex-it/master.scss',
    SASS_WWW_MASTER:     config.RESOURCES + 'sass/www/master.scss',
    SASS_TEAM_MASTER:    config.RESOURCES + 'sass/team/master.scss',
    SASS_IE8_MASTER:     config.RESOURCES + 'sass/ie8/master.scss',
    SASS_AWESOME_DIST:   config.DIST + 'css/font-awesome/',
    SASS_FLEX_DIST:      config.DIST + 'css/flex-it/',
    SASS_WWW_DIST:       config.DIST + 'css/www/',
    SASS_TEAM_DIST:      config.DIST + 'css/team/',
    SASS_IE8_DIST:       config.DIST + 'css/ie8/',

    // Libs of the project
    LIBS_ALL: [
        config.BOWER + 'es5-shim/es5-shim.min.js',
        config.BOWER + 'es5-shim/es5-shim.map',
        config.BOWER + 'es5-shim/es5-sham.min.js',
        config.BOWER + 'es5-shim/es5-sham.map',
        config.BOWER + 'react/react-with-addons.js',
        config.BOWER + 'react/react-with-addons.min.js',
        config.BOWER + 'async/lib/async.js',
        config.BOWER + 'director/build/director.min.js',
        config.BOWER + 'Chart.js/Chart.min.js',
        config.BOWER + 'flux/dist/Flux.js',
        config.BOWER + 'ExplorerCanvas/excanvas.js'
    ],
    LIBS_DIST:           config.DIST + 'lib/'
};