#!/bin/bash

# Get the action to run
ACTION=$1;
SCRIPTS_FOLDER="./resources/scripts";
DIST_FOLDER="./public/dist/js";

REQUIRE_FILE='./resources/scripts/team/core-require.js';

function generate-require-js-core-name() {
    # Remove the parent path
    OLD_1="./resources/scripts/team/core";
    OLD_1="${OLD_1//\//\\/}"
    NEW_1="core";
    # Remove the .js Extension
    OLD_2=".js";
    NEW_2="";
    echo "require('$(echo $1 | sed "s/$OLD_1/$NEW_1/g" | sed "s/$OLD_2/$NEW_2/g")');"
}

function generate-require-jsx-core-name() {
    # Remove the parent path
    OLD_1="./resources/scripts/team/core";
    OLD_1="${OLD_1//\//\\/}"
    NEW_1="core";
    echo "require('$(echo $1 | sed "s/$OLD_1/$NEW_1/g")');"
}

function generate-require-jsx-pages-name() {
    # Remove the parent path
    OLD_1="./resources/scripts/team/pages";
    OLD_1="${OLD_1//\//\\/}"
    NEW_1="pages";
    echo "require('$(echo $1 | sed "s/$OLD_1/$NEW_1/g")');"
}

function generate-require-jsx-common-name() {
    # Remove the parent path
    OLD_1="./resources/scripts/common/templates";
    OLD_1="${OLD_1//\//\\/}"
    NEW_1="templates";
    echo "require('$(echo $1 | sed "s/$OLD_1/$NEW_1/g")');"
}

function generate-require() {
    echo "Generating 'core-require'...";

    # Reset the generated file
    echo "'use strict';" > $REQUIRE_FILE;

    find ./resources/scripts/team/core/{lib,actions,stores} -name \*.js -print | while read x; do generate-require-js-core-name $x; done >> $REQUIRE_FILE;
    find ./resources/scripts/team/core/templates -name \*.jsx -print | while read x; do generate-require-jsx-core-name $x; done >> $REQUIRE_FILE;
    find ./resources/scripts/team/pages -name \*.jsx -print | while read x; do generate-require-jsx-pages-name $x; done >> $REQUIRE_FILE;
    find ./resources/scripts/common/templates -name \*.jsx -print | while read x; do generate-require-jsx-common-name $x; done >> $REQUIRE_FILE;

    # Extract the require function
    echo "module.exports=function(module){return require(module);};" >> $REQUIRE_FILE;
    echo "'core-require' generated!";
}

generate-require

function start-watchify() {
    watchify -v -d -t [ reactify --es6 ] $SCRIPTS_FOLDER/$1 -o $DIST_FOLDER/$2
}

function watch-lib() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/lib start-watchify lib.js lib.min.js
}

function watch-www() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/www start-watchify www.js www.min.js
}

function watch-team() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/team start-watchify team.js team.min.js
}

function watch-apps() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/team/apps/${1} start-watchify team/apps/${1}/_load.js apps/app-${1}.min.js
}

function watch-all-apps() {
    for D in resources/scripts/team/apps/*; do
        if [ -d "${D}" ]; then
            watch-apps ${D##*/} &
        fi
    done
}

function start-build() {
    NODE_ENV=production browserify -t [ reactify --es6 ] $SCRIPTS_FOLDER/$1 | uglifyjs > $DIST_FOLDER/$2
}

function build-lib() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/lib start-build lib.js lib.min.js
}

function build-www() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/www start-build www.js www.min.js
}

function build-team() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/team start-build team.js team.min.js
}

function build-apps() {
    NODE_PATH=$NODE_PATH:$SCRIPTS_FOLDER/common:$SCRIPTS_FOLDER/team/apps/${1} start-build team/apps/${1}/_load.js apps/app-${1}.min.js
}

function build-all-apps() {
    for D in resources/scripts/team/apps/*; do
        if [ -d "${D}" ]; then
            build-apps ${D##*/}
        fi
    done
}

echo "Running: ${ACTION}"

case ${ACTION} in
    "watch")
        watch-lib & watch-www & watch-all-apps & watch-team
        ;;
    "watch-lib")
        watch-lib
        ;;
    "watch-team")
        watch-team
        ;;
    "watch-www")
        watch-www
        ;;
    "watch-apps")
        watch-all-apps
        ;;
    "build")
        build-lib && build-www && build-all-apps && build-team
        ;;
    "build-lib")
        build-lib
        ;;
    "build-team")
        build-team
        ;;
    "build-www")
        build-www
        ;;
    "build-apps")
        build-all-apps
        ;;
esac

