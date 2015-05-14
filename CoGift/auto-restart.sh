#/!bin/sh
# auto-restart.sh - Restart component for ASP.NET vNext on Mac OS X
# .. Used in conjunction with ./watch.sh

# screen -S vnext -p 0 -X stuff $'pkill -f kestrel\n'
screen -S vnext -p 0 -X stuff $'q\n'

while [ 1 ]
do
    pid=`ps -ef | grep "kestrel" | grep -v grep | awk ' {print $2}'`
    if [ "$pid" = "" ]
    then
            screen -S vnext -p 0 -X stuff $'dnx . kestrel\n'
            exit
    fi
    sleep 0.05
done