---
title: Installation
pubDatetime: 2021-11-13
description: Installation
tags: [cookbooks, postfix]
---

## 1.1. Install postfix and opendkim

apt-get install postfix opendkim -y

## 1.2. Modify postfix configuration

hint: don’t set ‘mydestination=pronostic-facile.fr’ else any bounce or postmaster will be delivred localy

    postconf -e mydomain=pronostic-facile.fr
    postconf -e inet_protocols=ipv4
    postconf -e myhostname=pronostic-facile.fr
    postconf -e smtpd_sasl_local_domain=pronostic-facile.fr
    postconf -e smtpd_sasl_auth_enable=yes
    postconf -e smtpd_sasl_tls_security_options="noanonymous, noplaintext"
    postconf -e broken_sasl_auth_clients=yes
    postconf -e smtpd_recipient_restrictions="permit_sasl_authenticated, permit_mynetworks, reject_unauth_destination"
    postconf -e milter_default_action=accept
    postconf -e milter_protocol=2
    smtp_helo_name = pronostic-facile.fr
    default_destination_concurrency_limit = 20
    address_verify_map = memcache:/etc/postfix/verify-memcache.cf
    address_verify_cache_cleanup_interval = 0

`myhostname`: This is the hostname of your machine. But don't put the full hostname. If your machine hostname is mail.mydomain.com you will only use mydomain.
`mydestination`: This parameter specifies what destinations this machine will deliver locally. The default is:

mydestination = $myhostname localhost.$mydomain localhost

## 1.3. Submission (port: 587) configuration

    submission inet n – n – – smtpd
    -o smtpd_tls_security_level=encrypt
    -o smtpd_sasl_auth_enable=yes

    smtp       inet n       -       n       -       -       smtpd -v
    submission inet n       -       n       -       -       smtpd
            -o smtpd_etrn_restrictions=reject
            -o smtpd_sasl_type=dovecot
            -o smtpd_sasl_path=private/auth
            -o smtpd_sasl_auth_enable=yes
            -o smtpd_reject_unlisted_sender=yes
            -o smtpd_recipient_restrictions=permit_mynetworks,permit_sasl_authenticated,reject

## 1.4. Restart postfix

    service postfix restart

## 1.5. Keep on time

Add ntp time-date (very important to maintain the date-time stamp when dealing with emails)

    ntpdate ntp.pool.org
    service ntpd start
    chkconfig ntpd on
