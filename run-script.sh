#!/bin/bash

# Get the action to run
ACTION=$1;
SCRIPTS_FOLDER="./resources/scripts";
DIST_FOLDER="./public/dist/js";

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

#for D in resources/scripts/application/apps/*; do [ -d \"${D}\" ] && NODE_PATH=$NODE_PATH:./resources/scripts watchify -v -d -t [ reactify --es6 ] ${D}/_load.js -o public/dist/js/apps/${D##*/}.min.js & :; done

echo "Running: ${ACTION}"

case ${ACTION} in
    "watch")
        watch-lib & watch-www & watch-team
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
    "build")
        build-lib & build-www & build-team
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
esac

