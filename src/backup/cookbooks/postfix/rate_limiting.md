---
title: Postfix - Rate limiting
created: 2021-11-13T00:00
description: Postfix - Rate limiting
---

References:

(https://steam.io/2013/04/01/postfix-rate-limiting/)
https://wiki.wordtothewise.com/ISP_Summary_Information

## 6.1. Add policies in /etc/postfix/master.cf

    polite unix - - n - - smtp
    turtle unix - - n - - smtp

2. Map domain to its transport name. For this add the following to `/etc/postfix/transport`

   gmail.com polite:
   yahoo.com turtle:
   hotmail.com polite:
   aol.com turtle:

3. Modify postfix configuration to specify the rate limit,

   postconf -e "polite_destination_concurrency_limit = 4"
   postconf -e "polite_destination_rate_delay = 0"
   postconf -e "polite_destination_recipient_limit = 10"
   postconf -e "turtle_destination_rate_delay = 3s"
   postconf -e "turtle_destination_concurrency_limit = 20"
   postconf -e "turtle_destination_recipient_limit = 4"

Restart postfix

    service postfix restart

other solution

Now, define required additional transport in postfix master.cf file:

    smtp-gmail unix -    -    n    -    1    smtp
          -o syslog_name=smtp-gmail

Define the required throttling (rate limits) settings in postfix main.cf

    smtp-gmail_destination_rate_delay = 12s
    smtp-gmail_destination_concurrency_limit = 1
    smtp-gmail_destination_recipient_limit = 2
    smtp-gmail_initial_destination_concurrency=1

The syntax is as follows: `transtport-name_variable-name=value`

Add the following to /etc/postfix/transport

    /\@gmail\.com$/       smtp-gmail:

The format of the above file is regexp. Lookups to regexp tables are fast so probably you should use those. For regexp to work you should have regexp support built into postfix. Find out using this command

    postconf -m

Once the transport file is created, make sure to create the corresponding db, which will be actually used by postfix. Use postmap command.

      postmap  /etc/postfix/transport

Make postfix use this transport table. Edit main.cf and add the following:

    transport_maps = regexp:/etc/postfix/transport

Make sure you use regexp prefix.

Reload postfix

    postfix reload



    transport_maps = hash:/etc/postfix/transport, regexp:/etc/postfix/transport_gmail

    # cat /etc/postfix/transport_gmail
    /\@gmail\.com$/ smtp-gmail:

!!! note
No need to postmap this file

Delay=2s caused transport invocation every 4 seconds in my experience.

`/etc/postfix/transport` file like this:

    # Yahoo (USA)
    yahoo.com       yahoo:
    ymail.com       yahoo:
    rocketmail.com  yahoo:

    # Yahoo (INTL)
    yahoo.ae        yahoo:
    yahoo.at        yahoo:
    yahoo.be        yahoo:
    yahoo.ca        yahoo:
    yahoo.ch        yahoo:
    yahoo.cn        yahoo:
    yahoo.co.il     yahoo:
    yahoo.co.in     yahoo:
    yahoo.co.jp     yahoo:
    yahoo.co.kr     yahoo:
    yahoo.co.nz     yahoo:
    yahoo.co.th     yahoo:
    yahoo.co.uk     yahoo:
    yahoo.co.za     yahoo:
    yahoo.com.ar    yahoo:
    yahoo.com.au    yahoo:
    yahoo.com.br    yahoo:
    yahoo.com.cn    yahoo:
    yahoo.com.hk    yahoo:
    yahoo.com.mx    yahoo:
    yahoo.com.my    yahoo:
    yahoo.com.ph    yahoo:
    yahoo.com.sg    yahoo:
    yahoo.com.tr    yahoo:
    yahoo.com.tw    yahoo:
    yahoo.com.vn    yahoo:
    yahoo.cz        yahoo:
    yahoo.de        yahoo:
    yahoo.dk        yahoo:
    yahoo.en        yahoo:
    yahoo.es        yahoo:
    yahoo.fi        yahoo:
    yahoo.fr        yahoo:
    yahoo.gr        yahoo:
    yahoo.ie        yahoo:
    yahoo.it        yahoo:
    yahoo.nl        yahoo:
    yahoo.no        yahoo:
    yahoo.pl        yahoo:
    yahoo.pt        yahoo:
    yahoo.ro        yahoo:
    yahoo.ru        yahoo:
    yahoo.se        yahoo:
    # Yahoo
    ymail.com       yahoo:
    rocketmail.com  yahoo:
    yahoo.com 	smtpslow:
    gmail.com 	smtpslow:
    hotmail.com smtpslow:
    aol.com 	smtpslow:
    comcast.com smtpslow:
    live.com 	smtpslow:
    msn.com 	smtpslow:
    sbcglobal.net smtpslow:
    verizon.net 	smtpslow:
    bellsouth.net smtpslow:
    yahoo.ca 	smtpslow:
    cox.net 	smtpslow:
    ymail.com 	smtpslow:

Once you’re done editing the /etc/postfix/transport file (and after every edit from now on), remember to do: # postmap /etc/postfix/transport

    /etc/postfix/transport.regexp that looks like this:

    # Yahoo Wildcards
    /yahoo(\.[a-z]{2,3}){1,2}$/  yahoo:

    yahoo     unix  -       -       n       -       -       smtp
            -o syslog_name=postfix-yahoo

Back up your /etc/postfix/main.cf file, then add these lines:

    transport_maps = hash:/etc/postfix/transport, regexp:/etc/postfix/transport.regexp

    yahoo_initial_destination_concurrency = 1
    yahoo_destination_concurrency_limit = 4
    yahoo_destination_recipient_limit = 2
    yahoo_destination_rate_delay = 1s

This tells Postfix to check your /etc/postfix/transport and /etc/postfix/transport.regexp files to look up which domains you’ve mapped to which transport, then it sets four specific configurations for the “yahoo” transport:

- `yahoo_initial_destination_concurrency = 1` will start out slowly by only sending one message per SMTP connection to a Yahoo’s MTA.
- `yahoo_destination_concurrency_limit = 4` after starting out slowly with just 1 message, Postfix will increase to allow up to four messages per SMTP connection to a Yahoo MTA.
- `yahoo_destination_recipient_limit = 2` will send the same message to no more than 2 recipients at a time
- `yahoo_destination_rate_delay = 1s` will add a 1 second delay between the messages

final version:

    /pronostic-facile\.fr/ relay:[ASPMX.L.GOOGLE.COM]

    /gmail\.com/ polite:
    /yahoo\.com/ turtle:
    /hotmail(\.[a-z]{2,3}){1,2}$/ polite:
    /live(\.[a-z]{2,3}){1,2}$/ polite:
    /outlook(\.[a-z]{2,3}){1,2}$/ polite:
    /aol\.com/	turtle:
    /yahoo(\.[a-z]{2,3}){1,2}$/ turtle:

Basically, you may take the following steps as reference:

- Create a seperate mail for the destination is yahoo, let's name it 'slow' queue
  (You may search in this mailling list too, someone has asked before)

- After Postfix 2.5, set slow_destination_rate_delay for certain period of time for 'slow'
  In my case, I set to 300s. That's mean 5 mins per delivery to yahoo

- Set slow_destination_concurrency_limit & slow_destination_recipient_limit for 'slow'
  In may case, I set
  slow_destination_concurrency_limit = 2
  slow_destination_recipient_limit = 10

- In Postfix 2.5.5 or earlier, disable defer retry failure giving up limit for 'slow'.
  I my case, I set
  slow_concurrency_failed_cohort_limit = $slow_destination_concurrency_failed_cohort_limit
  slow_destination_concurrency_failed_cohort_limit = 0

## STEP 1: SETTING UP THE TRANSPORT MAPS

The first step is to determine which domains you want to treat differently. Obviously, in this example, we’re trying to set up something to eliminate (or at least reduce) Yahoo’s deferrals. So edit the /etc/postfix/transport file and create some maps that tell Postfix exactly which email domains are going to get the special “Yahoo” treatment. The email domain goes on the left, and the name of your custom transport goes on the right (always followed by a colon). The most basic approach would be to specifically list all the Yahoo email domains you want to cover in your /etc/postfix/transport file like this:

    # Yahoo (USA) yahoo.com       yahoo: ymail.com       yahoo: rocketmail.com  yahoo:  # Yahoo (INTL) yahoo.ae        yahoo: yahoo.at        yahoo: yahoo.be        yahoo: yahoo.ca        yahoo: yahoo.ch        yahoo: yahoo.cn        yahoo: yahoo.co.il     yahoo: yahoo.co.in     yahoo: yahoo.co.jp     yahoo: yahoo.co.kr     yahoo: yahoo.co.nz     yahoo: yahoo.co.th     yahoo: yahoo.co.uk     yahoo: yahoo.co.za     yahoo: yahoo.com.ar    yahoo: yahoo.com.au    yahoo: yahoo.com.br    yahoo: yahoo.com.cn    yahoo: yahoo.com.hk    yahoo: yahoo.com.mx    yahoo: yahoo.com.my    yahoo: yahoo.com.ph    yahoo: yahoo.com.sg    yahoo: yahoo.com.tr    yahoo: yahoo.com.tw    yahoo: yahoo.com.vn    yahoo: yahoo.cz        yahoo: yahoo.de        yahoo: yahoo.dk        yahoo: yahoo.en        yahoo: yahoo.es        yahoo: yahoo.fi        yahoo: yahoo.fr        yahoo: yahoo.gr        yahoo: yahoo.ie        yahoo: yahoo.it        yahoo: yahoo.nl        yahoo: yahoo.no        yahoo: yahoo.pl        yahoo: yahoo.pt        yahoo: yahoo.ro        yahoo: yahoo.ru        yahoo: yahoo.se        yahoo:

However, listing all those domains forces you to stay up to date with any new domains that Yahoo might launch. So a smarter approach would be to two transport maps: one that’s a regular hash table, and another with a regular expression that simply catches any domain that starts with yahoo.
First, put ymail.com and rocketmail.com in your /etc/postfix/transport file, like this:

    # Yahoo ymail.com
    yahoo: rocketmail.com  yahoo:

Once you’re done editing the /etc/postfix/transport file (and after every edit from now on), remember to do:

    postmap /etc/postfix/transport

to build the transport.db file.
Next, create a file called /etc/postfix/transport.regexp that looks like this:

# Yahoo Wildcards /yahoo(\.[a-z]{2,3}){1,2}$/ yahoo:

That will catch all “yahoo dot anything” domains. Note that you don’t need to run postmap on regular expression tables, so now you’re ready to tell Postfix how to read your transports.
Step 2: Include the New Custom Transports in master.cf
As always, before messing with /etc/postfix/master.cf, make a backup. Then add the following lines at the bottom:
yahoo unix - - n - - smtp -o syslog_name=postfix-yahoo
-o smtp_connect_timeout=5 -o smtp_helo_timeout=5

This tells Postfix that the transport called “yahoo” gets handed off to the Postfix smtp process, and the -o syslog_name option tags the use of this transport in the mail log so I easily tell when this transport is used.
Step 3: Create Custom Settings in main.cf
The third step of the process is to create some custom settings in your main.cf file to tell Postfix exactly what to do differently when it encounters an outbound mail domain that matches your transport maps. Back up your /etc/postfix/main.cf file, then add these lines:
transport_maps = hash:/etc/postfix/transport, regexp:/etc/postfix/transport.regexp yahoo_initial_destination_concurrency = 1 yahoo_destination_concurrency_limit = 4 yahoo_destination_recipient_limit = 2
yahoo_destination_rate_delay = 1s
This tells Postfix to check your /etc/postfix/transport and/etc/postfix/transport.regexp files to look up which domains you’ve mapped to which transport, then it sets four specific configurations for the “yahoo” transport:
• yahoo_initial_destination_concurrency = 1 will start out slowly by only sending one message per SMTP connection to a Yahoo’s MTA.
• yahoo_destination_concurrency_limit = 4 after starting out slowly with just 1 message, Postfix will increase to allow up to four messages per SMTP connection to a Yahoo MTA.
• yahoo_destination_recipient_limit = 2 will send the same message to no more than 2 recipients at a time
• yahoo_destination_rate_delay = 1s will add a 1 second delay between the messages
This is where the Postfix voodoo kicks in for me, so feel free to experiment with these settings and tweak to your liking. The destination concurrency limit and the rate delay are the two you’ll probably want to tinker to keep Yahoo happy. Depending on your mailer reputation, they’ll be more strict or more relaxed on what they’ll allow for these two settings. The above settings that happen to work for my needs, but I still tweak them to experiment, and if you have a configuration that works well with Yahoo (or if you have other custom transports that help increase delivery), please feel free to share them in the comments.
Step 4: Restart Postfix and Test
Now you’re ready to try things out. Start the Postfix configuration with:

# service postfix restart

You can’t just do a postfix reload, because changes to the master.cf require a full restart. Finally, do a tail -f on your maillog. On my CentOS system, that’s:
tail -f /var/log/maillog
Now send a message to a Yahoo test account (I’m assuming you have an @yahoo.com test account) from or through your Postfix server. If everything worked right, you should see log entries that start with the date, local hostname, and then say postfix-yahoo/smtp. These are the messages that are being diverted through your new transport!
After using these settings for a few mailings, I’ve seen a drastic reduction in the amount of time it takes to deliver tens of thousands of opt-in email to Yahoo recipients. Hopefully, they’ll work for you, too!
Your feedback and comments are welcome below, and I’m especially interested to hear of any other custom transports you may be using, as well as your experiences with different settings for Yahoo.

La file des messages se rempli alors très rapidement pour monter facilement à plusieurs dizaine de milliers de mails en attente d’envoi et surtout totalement bloqués !
Autre souci les mails sont en status deferred, et seront donc supprimé de la file dans un délai de 5 jours par défaut (voir la configuration demaximal_queue_lifetime). C’est insuffisant pour laisser s’écouler les mails en attente !
Pour les serveurs de mail que je gère j’ai « bidouillé » un script pour vider manuellement la queue pour les mails destinés à Orange/Wanadoo afin que les personnes aient leur mail au plus tôt !
Mais il fallait trouver une solution plus durable…
J’en ai mise une en place, elle n’est pas parfaite mais elle a permis de gérer et de délivrer les mailings de ces fêtes de fin d’année en temps et en heure !
Détails de la solution : transport spécifique pour orange/wanadoo
/etc/postfix/transport

    wanadoo.com slow:
    wanadoo.fr slow:
    orange.com slow:
    orange.fr slow:
    puis postmap /etc/postfix/transport
    dans /etc/postfix/master.cf

    #==========================================================================
    # service type private unpriv chroot wakeup maxproc command + args
    # (yes) (yes) (yes) (never) (100)
    #==========================================================================
    slow unix - - n - 5 smtp
    -o syslog_name=postfix-slow
    -o smtp_destination_concurrency_limit=3
    -o slow_destination_rate_delay=1
    dans /etc/postfix/main.cf

    slow_destination_recipient_limit = 20
    slow_destination_concurrency_limit = 2
    et finalement : /etc/init.d/postfix reload
    Les mails se stockent tout de même en queue, mais la file se vide ensuite relativement rapidement !
    orange_destination_recipient_limit = 20
    orange_destination_concurrency_limit = 2
    orange_destination_concurrency_limit = 3
    orange_destination_rate_delay = 1s
