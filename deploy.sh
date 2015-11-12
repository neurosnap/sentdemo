#!/usr/bin/env bash

printer(){
    printf '\n' && printf '=%.0s' {1..40} && printf '\n'
    echo $1
    printf '=%.0s' {1..40} && printf '\n'
}

printer 'Stopping server'
supervisorctl stop sentdemo

printer 'Replacing binary file'
rm $SENTDEMO_DIR/sentdemo
mv $SENTDEMO_DIR/sentdemo_new $SENTDEMO_DIR/sentdemo

printer 'Starting server'
supervisorctl start sentdemo
