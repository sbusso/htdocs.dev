---
title: Postfix - Monitoring
created: 2021-11-13T00:00
description: Postfix - Monitoring
---

## Mailgraph And pflogsumm

Want to support HowtoForge? Become a subscriber!
Submitted by falko (Contact Author) (Forums) on Mon, 2006-07-03 15:58. ::

4 Fedora Core 5
4.1 Mailgraph

There's no Mailgraph package available for Fedora Core 5, so we must install it manually. First, we need to install the prerequsities that Mailgraph requires:

    yum install rrdtool rrdtool-perl perl-File-Tail

Then we download the Mailgraph sources and copy the Mailgraph scripts to the appropriate locations:

    cd /tmp
    wget https://people.ee.ethz.ch/~dws/software/mailgraph/pub/mailgraph-1.12.tar.gztar xvfz mailgraph-1.12.tar.gzcd mailgraph-1.12mv mailgraph.pl /usr/local/bin/mailgraph.plmv mailgraph-init /etc/init.d/mailgraph

Now we must adjust the Mailgraph init script /etc/init.d/mailgraph:

    vi /etc/init.d/mailgraph

On Fedora, the Postfix mail log is /var/log/maillog, so we change

    MAIL_LOG=/var/log/syslog
    MAIL_LOG=/var/log/maillog

Then we add another variable to /etc/init.d/mailgraph, IGNORE_LOCALHOST. If you have integrated a content filter like amavisd into Postfix, add this line

    IGNORE_LOCALHOST="--ignore-localhost"

to the block where the variables like MAIL_LOG are defined. If you don't use a content filter, add this line instead:

    IGNORE_LOCALHOST=""

In both cases, change

    nice -19 $MAILGRAPH_PL -l $MAIL_LOG -d \
            --daemon-pid=$PID_FILE --daemon-rrd=$RRD_DIR
    nice -19 $MAILGRAPH_PL -l $MAIL_LOG -d \
            --daemon-pid=$PID_FILE --daemon-rrd=$RRD_DIR $IGNORE_LOCALHOST

So the final script should look like this (in this case, with --ignore-localhost enabled):

    #!/bin/sh

    # $Id: mailgraph-init,v 1.4 2005/06/13 11:23:22 dws Exp $
    # example init script for mailgraph
    #
    # chkconfig: 2345 82 28
    # description: mailgraph postfix log grapher.
    #
    # processname: mailgraph.pl
    # pidfile: /var/run/mailgraph.pid


    PATH=/bin:/usr/bin
    MAILGRAPH_PL=/usr/local/bin/mailgraph.pl
    MAIL_LOG=/var/log/maillog
    PID_FILE=/var/run/mailgraph.pid
    RRD_DIR=/var/lib
    IGNORE_LOCALHOST="--ignore-localhost"

    case "$1" in
    'start')
            echo "Starting mail statistics grapher: mailgraph";
            nice -19 $MAILGRAPH_PL -l $MAIL_LOG -d \
                    --daemon-pid=$PID_FILE --daemon-rrd=$RRD_DIR $IGNORE_LOCALHOST
            ;;

    'stop')
            echo "Stopping mail statistics grapher: mailgraph";
            if [ -f $PID_FILE ]; then
                    kill `cat $PID_FILE`
                    rm $PID_FILE
            else
                    echo "mailgraph not running";
            fi
            ;;

    *)
            echo "Usage: $0 { start | stop }"
            exit 1
            ;;

    esac
    exit 0

Next we make the script executable, create the appropriate system startup links and start Mailgraph:

    chmod 755 /etc/init.d/mailgraphchkconfig --levels 235 mailgraph on/etc/init.d/mailgraph start

Still in the /tmp/mailgraph-1.12 directory, we move mailgraph.cgi to our cgi-bin directory:

    mv mailgraph.cgi /var/www/www.example.com/cgi-bin/

Now we open the file and adjust the locations of the two Mailgraph databases.

    vi /var/www/www.example.com/cgi-bin/mailgraph.cgi

Change

    my $rrd = 'mailgraph.rrd'; # path to where the RRD database is
    my $rrd_virus = 'mailgraph_virus.rrd'; # path to where the Virus RRD database is
    my $rrd = '/var/lib/mailgraph.rrd'; # path to where the RRD database is
    my $rrd_virus = '/var/lib/mailgraph_virus.rrd'; # path to where the Virus RRD database is

Then we make the script executable:

    chmod 755 /var/www/www.example.com/cgi-bin/mailgraph.cgi

If you use suExec for the www.example.com web site, you must chown mailgraph.cgi to the appropriate owner and group.

Now direct your browser to https://www.example.com/cgi-bin/mailgraph.cgi, and you should see some graphs. Of course, there must be some emails going through your system before you see the first results, so be patient.

### 4.2 pflogsumm

The steps differ only slightly from those on Debian and Ubuntu. The main difference is that Postfix logs to /var/log/maillog on Fedora instead of /var/log/mail.log (Debian/Ubuntu) (pay attention to the dot!).

First we install pflogsumm:

    yum install postfix-pflogsumm

We want pflogsumm to be run by a cron job each day and send the report to postmaster@example.com. Therefore we must configure our system that it writes one mail log file for 24 hours, and afterwards starts the next mail log so that we can feed the old mail log to pflogsumm. Therefore we configure logrotate (that's the program that rotates our system's log files) like this: open /etc/logrotate.conf and append the following stanza to it, after the line # system-specific logs may be configured here:

    vi /etc/logrotate.conf
    /var/log/maillog {
        missingok
        daily
        rotate 7
        create
        compress
        start 0
    }
    Also change /etc/logrotate.d/syslog
    vi /etc/logrotate.d/syslog
    /var/log/messages /var/log/secure /var/log/maillog /var/log/spooler /var/log/boot.log /var/log/cron {
        sharedscripts
        postrotate
            /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
        endscript
    }
    /var/log/messages /var/log/secure /var/log/spooler /var/log/boot.log /var/log/cron {
        sharedscripts
        postrotate
            /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
        endscript
    }

There's a logrotate script in /etc/cron.daily. This script is called everyday between 06:00h and 07:00h. With the configuration we just made, it will copy the current Postfix log /var/log/maillog to /var/log/maillog.0 and compress it, and the compressed file will be /var/log/maillog.0.gz. It will also create a new, empty /var/log/maillog to which Postfix can log for the next 24 hours.

Now we create the script /usr/local/sbin/postfix_report.sh which invokes pflogsumm and makes it send the report to postmaster@example.com:

    vi /usr/local/sbin/postfix_report.sh
    #!/bin/sh
    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    gunzip /var/log/maillog.0.gz

    pflogsumm /var/log/maillog.0 | formail -c -I"Subject: Mail Statistics" -I"From: pflogsumm@localhost" -I"To: postmaster@example.com" -I"Received: from www.example.com ([192.168.0.100])" | sendmail postmaster@example.com

    gzip /var/log/maillog.0
    exit 0

We must make this script executable:

    chmod 755 /usr/local/sbin/postfix_report.sh

Then we create a cron job which calls the script everyday at 07:00h:

crontab -e 0 7 \* \* \* /usr/local/sbin/postfix_report.sh &> /dev/null

This will send the report to postmaster@example.com.

mailgraph statistics for postfix running on nginx

I’m using postfix as my mail server. In order to get nice graphical overview about the server activity I’m using mailgraph.Mailgraph is a cgi script written in perl. It uses rrdtool to produce daily, weekly, monthly and yearly graphs of received/sent and bounced/rejected mail.

Installing mailgraph on debian is as easy as running:

    aptitude install mailgraph

The configuration takes place in /etc/default/mailgraph. Make sure to modify it according to your mail setup.
In order to run in on nginx server, one needs to install fcgiwrap and spawn-fcgi first. Nothing simpler than that:

    aptitude install fcgiwrap spawn-fcgi

Configuring nginx to use fcgiwrap requires the following:

Creation of the /etc/nginx/conf.d/fcgiwrap.conf file with the following content:

    .	upstream fcgiwrap {
    .	   server unix:/var/run/fcgiwrap.socket;
    .	}
    .	Instructions to the nginx, to pass the cgi scripts to fcgiwrap (done in the server section for the virtual host):
    .	location ~ \.cgi$ {
    .	   root /usr/lib/cgi-bin;
    .	   include /etc/nginx/fastcgi_params;
    .	   fastcgi_pass fcgiwrap;
    .	}

The result for weekly statistics looks like shown below:

## Simple Bash Monitoring

You can monitor the queues with a simple bashscript:

    #!/bin/bash # 20.06.2011 - JJaritsch @ ANEXIA Internetdienstleistungs GmbH # jj@anexia.at  queuelength=`/usr/sbin/postqueue -p | tail -n1 | awk '{print $5}'` queuecount=`echo $queuelength | grep "[0-9]"`  if [ "$queuecount" == "" ]; then         echo 0; else         echo ${queuelength}; fi exit 35

Save this script and make it executable (0755 is enough) for the snmpd user. The next step is to add the following line to your snmpd.conf:

    exec postqueue /path/to/your/snmp_monitor_postqueue.sh

If you want to use sudo, you can add this line:

    exec postqueue /usr/bin/sudo /path/to/your/snmp_monitor_postqueue.sh

In case of sudo you also have to add the following to your sudoers file (so there is no auth required to execute this script):

    snmp ALL=(ALL) NOPASSWD: /path/to/your/snmp_monitor_postqueue.sh

Reload your snmpd - you will find the count-result in .1.3.6.1.4.1.2021.8.1.101.\* (for example in .1.3.6.1.4.1.2021.8.1.101.1 if you have no other additional lines in the snmpd.conf).

## Another monitoring Bash – MSMTP

In addition to Bryan Rehbein's answer above, here's a script I use to monitor postfix queue lengths. All it does is send an email alert once a queue grows beyond X messages in size. The alert is sent using msmtp (a tiny command line smtp client) so it bypasses the local postfix installation (which you can't rely on to get your alert out in a timely fashion if its queues are growing...)

    #!/bin/bash
    # # Postfix queue length monitoring script (requires msmtp)
    # # This script checks the active, incoming, deferred and maildrop postfix queue directories.
    # # If the number of messages in any of these directories is more than $MAX_QUEUE_LENGTH,
    # the script will generate an alert email and send it using msmtp. We use msmtp so that # we can bypass the local postfix installation (since if the queues are getting big, # the alert email may not be sent in time to catch the problem).
    #  ########################################################
    # # SET SCRIPT VARS ########################################################
    #  # Path to msmtp binary (e.g. /usr/bin/msmtp on Debian systems) MSMTP=/usr/bin/msmtp
    # Remote mail host (this is the mail server msmtp will use to send the alert. It should NOT be the local postfix installation) MAILHOST=backup.mailserver.com
    # Remote mail port MAILPORT=25
    # Mail protocol MAILPROTO=smtp
    # Fully qualified domain name of local postfix installation DOMAIN=primary.mailserver.com
    # From address MAILFROM=postmaster@mailserver.com
    # Recipient (this address should not route to the local postfix installation, for obvious reasons) MAILTO="alerts@anotherdomain.com"
    # Email subject MAILSUBJECT="Postfix queue length alert for ${DOMAIN}"  # MSMTP log file LOGFILE=/var/log/msmtp.log
    # Root of the postfix queue dirs (e.g. /var/spool/postfix on Debian systems). Note: no trailing slash. QUEUEDIR_ROOT="/var/spool/postfix"
    # Max queue length (if there are more messages in a queue than this number, we will send an alert) MAX_QUEUE_LENGTH=10   #########################################################
    # SCRIPT LOGIC STARTS HERE #########################################################

    # Check msmtp binary exists

    if [ ! -f ${MSMTP} ] then         echo "Cannot find ${MSMTP}. Exiting."         exit 1 fi  # Get the number of messages sitting in each postfix queue directory Q_ACTIVE=$(find ${QUEUEDIR_ROOT}/active -type f | wc -l) Q_INCOMING=$(find ${QUEUEDIR_ROOT}/incoming -type f | wc -l) Q_DEFERRED=$(find ${QUEUEDIR_ROOT}/deferred -type f | wc -l) Q_MAILDROP=$(find ${QUEUEDIR_ROOT}/maildrop -type f | wc -l)  # If any of these queues contain more than $MAX_QUEUE_LENGTH issue an alert if [ ${Q_ACTIVE} -gt ${MAX_QUEUE_LENGTH} -o ${Q_INCOMING} -gt ${MAX_QUEUE_LENGTH} -o ${Q_DEFERRED} -gt ${MAX_QUEUE_LENGTH} -o ${Q_MAILDROP} -gt ${MAX_QUEUE_LENGTH} ]; then      (         echo "From: ${MAILFROM} "         echo "To: ${MAILTO} "         echo "Mime-Version: 1.0"         echo 'Content-Type: text/plain; charset="iso-8859-1"'         echo "Subject: ${MAILSUBJECT}"         echo ""         echo "One or more of the postfix queues on ${DOMAIN} has grown beyond ${MAX_QUEUE_LENGTH} messages in length."     ) | ${MSMTP} --host=${MAILHOST} --port=${MAILPORT} --protocol=${MAILPROTO} --domain=${DOMAIN} --auth=off --tls=off --from=${MAILFROM} --logfile=${LOGFILE} --syslog=off --read-recipients      exit 2  fi  exit 0
