#!/bin/sh
comm="ssh $1@$2 -p $3"
command -v xterm > /dev/null && xterm -e $comm || return 1
