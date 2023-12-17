---
title: Postfix - Domainkeys
pubDatetime: 2021-11-13
description: Postfix - Domainkeys
---

## 3.1. Install dk-filter milter package

    apt-get install dk-filter

## 3.2. Configuration

Copy paste the following into a text file and save as a bash script. You can change the variables “DOMAIN” and “SELECTOR” to the one you choose depending upon the requirement.

    DOMAIN="pronostic-facile.fr"
    SELECTOR="mail"

    mkdir -p /etc/domainkeys/${DOMAIN}/
    cd /etc/domainkeys/${DOMAIN}/
    openssl genrsa -out private.key 1024
    openssl rsa -in private.key -out public.key -pubout -outform PEM

    cat > /etc/domainkeys/trustlist.txt << EOF
    ${DOMAIN}
    `hostname`
    `ifconfig |grep "inet addr:"|awk '{print $2}'|cut -d: -f2|uniq`
    EOF

    cat >  /etc/default/dk-filter << EOF
    DAEMON_OPTS="-l"
    DAEMON_OPTS="$DAEMON_OPTS -d ${DOMAIN} -s /etc/domainkeys/${DOMAIN}/private.key -S ${SELECTOR} -i /etc/domainkeys/trustlist.txt"
    SOCKET="inet:8892@localhost"
    EOF

    postconf -e smtpd_milters="inet:localhost:8891,inet:localhost:8892"
    postconf -e non_smtpd_milters="inet:localhost:8891,inet:localhost:8892"

    service dk-filter restart
    service postfix restart

## 3.3. Update DNS

Publish the following DNS records. The public key is taken from file /etc/domainkeys/pronostic-facile.fr/public.key .

    _domainkey.pronostic-facile.fr. IN TXT "t=y; o=~;

    mail._domainkey.pronostic-facile.fr. IN TXT "k=rsa; t=y; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbG2dfmfhS2g5T5bKdzhh9oAxKHEGVJmOXcGT7bcSWsDKxXL6SWNaCl4HzHoPHVnRfjZYyNtehJ19FAupSlGme7wJNqQI6GTXAvApUYEbjKbffLfGresB6quuy//xjbK2H7J01apdvYHzDdmenwGVmufPoK4ASokm35plkXfXGVwIDAQAB"

Ref: [DomainKeys on Ubuntu](https://help.ubuntu.com/community/Postfix/DomainKeys)
