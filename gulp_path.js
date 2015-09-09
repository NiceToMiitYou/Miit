
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
        config.VIEWS + 'mail/sass/**/*.scss'
    ],
    SASS_WWW_MASTER:     config.RESOURCES + 'sass/www/master.scss',
    SASS_TEAM_MASTER:    config.RESOURCES + 'sass/team/master.scss',
    SASS_IE8_MASTER:     config.RESOURCES + 'sass/ie8/master.scss',
    SASS_APPS_MASTER:    config.RESOURCES + 'sass/apps/*/master.scss',
    SASS_MAIL_MASTER:    config.VIEWS + 'mail/sass/master.scss',
    SASS_WWW_DIST:       config.DIST + 'css/www/',
    SASS_TEAM_DIST:      config.DIST + 'css/team/',
    SASS_IE8_DIST:       config.DIST + 'css/ie8/',
    SASS_APPS_DIST:      config.DIST + 'css/apps/',
    SASS_MAIL_DIST:      config.VIEWS + 'mail/css/'
};