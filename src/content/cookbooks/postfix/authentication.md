---
title: Postfix - Authentication
pubDatetime: 2021-11-13
description: Postfix - Authentication
---

## 8.1. Install necessary services for authentication

    apt-get install sasl2-bin libsasl2-2 -y

## 8.2. Correct the permission of smtp authentication related files,

    chown postfix:sasl /var/run/saslauthd
    chown postfix:sasl /etc/sasldb2
    adduser postfix sasl
    /etc/init.d/postfix restart

## 8.3. Create configuration files for SMTP authentication

    cat > /etc/default/saslauthd <<EOF
    START=yes
    DESC="SASL Authentication Daemon"
    NAME="saslauthd"
    MECHANISMS="sasldb"
    MECH_OPTIONS=""
    THREADS=5
    OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd"
    EOF

    cat > /etc/postfix/sasl/smtpd.conf <<EOF
    pwcheck_method: saslauthd
    auxprop_plugin: sasldb
    saslauthd_path: /var/run/saslauthd/mux
    mech_list: PLAIN LOGIN CRAM-MD5 DIGEST-MD5
    EOF

## 8.4. Configure postfix to use sasldb for SMTP authentication,

    postconf -e "smtpd_sasl_local_domain=pronostic-facile.fr"
    postconf -e "smtpd_sasl_auth_enable=yes"
    postconf -e "smtpd_sasl_path=smtpd"
    postconf -e "smtpd_sasl_tls_security_options= noanonymous, noplaintext"
    postconf -e "broken_sasl_auth_clients=yes"

    /etc/init.d/saslauthd restart
    /etc/init.d/postfix restart

## 8.5. Create email user

    saslpasswd2 -c -u pronostic-facile.fr -f /etc/sasldb2 contact

    Password: 6523uu3FuWooM22

## 8.6. Testing

Create password hash

    perl -MMIME::Base64 -e 'print encode_base64("\000contact\@pronostic-facile.fr\0006523uu3FuWooM22");'dXNlcjEAdXNlcjEAWmRFeG1ocGRiclBsbw==

Send test email

    telnet 0 25

    Trying 0.0.0.0...
    Connected to 0.
    Escape character is '^]'.
    220 pronostic-facile.fr ESMTP Postfix (Ubuntu)

    EHLO pronostic-facile.fr

    250-pronostic-facile.fr
    250-PIPELINING
    250-SIZE 10240000
    250-VRFY
    250-ETRN
    250-STARTTLS
    250-AUTH PLAIN LOGIN CRAM-MD5 DIGEST-MD5
    250-AUTH=PLAIN LOGIN CRAM-MD5 DIGEST-MD5
    250-ENHANCEDSTATUSCODES
    250-8BITMIME
    250 DSN
    AUTH PLAIN AGNvbnRhY3RAcHJvbm9zdGljLWZhY2lsZS5mcgA2NTIzdXUzRnVXb29NMjI=
    235 2.7.0 Authentication successful
    MAIL FROM: contact@pronostic-facile.fr
    250 2.1.0 Ok
    RCPT TO: rnldpj@gmail.com
    250 2.1.5 Ok
    DATA
    354 End data with <CR><LF>.<CR><LF>
    Subject: Testing EMAIL
    This is a testing. Plz ignore.
    .
    250 2.0.0 Ok: queued as CDC8A4095F
    421 4.4.2 pronostic-facile.fr Error: timeout exceeded
    Connection closed by foreign host.
