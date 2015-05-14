#/!bin/sh
# watch.sh - FS watcher for ASP.NET vNext on Mac OS X
# .. Used in conjunction with ./auto-restart.sh
# .. To use run ./watch.sh from the Terminal

# Startup
pkill -f kestrel
pkill screen
screen -S vnext -d -m
screen -S vnext -p 0 -X stuff $'dnx . kestrel\n'

# Start file system watch ..
fswatch -o ./Controllers ./Models | xargs -n1 ./auto-restart.sh