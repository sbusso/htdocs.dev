---
title: Postfix - Advanced Setup
pubDatetime: 2021-11-13
description: Postfix - Advanced Setup
---

## load balancing with HAProxy

For SMTP, it is really important to know the client IP, since we use it most of the time through RBL to fight spam.
For security purpose as well: we may want to allow only some hosts to use our SMTP relays and block any other clients.
Without the proxy protocol, the load-balancer will hide the client IP with its own IP. You would have to maintain whitelists into the load-balancer (which is doable). Thanks to proxy protocol, Postscreen would be aware of the client IP, it means you could maintain lists directly into the MTA.

## SECURITY

To see if an outsider can reach you, run this command:

    telnet relay-test.mail-abuse.org
    host relay-test.mail-abuse.org

When you make this connection, relay-test.mail-abuse.org performs an online relay test of the machine that made the connection. If your ISP (or your own firewall) doesn't block incoming connections to your box on port 25, then you should see quite a few messages in your log file.

    netstat -t -a | grep LISTEN

    lsof -i tcp:25

## Test

Now let's turn our attention to smtp-sink to find out how many messages per second your server can handle from your horrible mass mailing sofware. Postfix has to process each outgoing message even if the server on the other side throws it away (therefore, you can't use this to test the raw performance of your mass mailer unless you connect your mailer directly to smtp-sink).

The following example sets up an SMTP listener on port 25 of localhost:

    ./smtp-sink -c localhost:25 1000

Now you can run your client tests.

If you want to get an idea for how much overhead the network imposes and also get a control experiment to see what the theoretical maximum throughput for a mail server, you can make smtp-source and smtp-sink talk to each other. Open two windows. In the first, start up the dummy server like this:

    ./smtp-sink -c localhost:25 1000 100

With this in place, start throwing messages at this server with smtp-source in the other window:

    time ./smtp-source -s 20 -l 5120 -m 100 -c -f sender@example.com -t recipient@example.com localhost:25 100

    real    0m0.239s
    user    0m0.000s
    sys     0m0.040s

## Install Local DNS server

Improve domain lookup and cache
