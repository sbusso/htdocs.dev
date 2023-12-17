---
title: Postfix - DMARC
created: 2021-11-13T00:00
description: Postfix - DMARC
---

## 4.1. Install opendmarc package

    apt-get install opendmarc

## 4.2. Configuration

Copy paste the following into a text file and save as a bash script. You can change the variable “DOMAIN” to the one you choose depending upon the requirement.

    DOMAIN="pronostic-facile.fr"
    mkdir /usr/local/etc/opendmarc/

    cat > /usr/local/etc/opendmarc/ignore.hosts << EOF
    ${DOMAIN}
    `hostname`
    `ifconfig |grep "inet addr:"|awk '{print $2}'|cut -d: -f2|uniq`
    EOF


    cat > /etc/opendmarc.conf << EOF
    AuthservID HOSTNAME
    Background true
    BaseDirectory /var/run/opendmarc
    CopyFailuresTo postmaster@${DOMAIN}
    IgnoreHosts /usr/local/etc/opendmarc/ignore.hosts
    PidFile /var/run/opendmarc/opendmarc.pid
    Socket inet:8893@localhost
    Syslog false
    SyslogFacility mail
    TemporaryDirectory /var/tmp
    TrustedAuthservIDs HOSTNAME
    UserID opendmarc
    EOF

    postconf -e smtpd_milters="inet:localhost:8891,inet:localhost:8892,inet:localhost:8893"
    postconf -e non_smtpd_milters="inet:localhost:8891,inet:localhost:8892,inet:localhost:8893"

    service opendmarc restart
    service postfix restart

## 4.3. Update DNS

Publish the corresponding dns record,

    _dmarc.pronostic-facile.fr. IN TXT "v=DMARC1;p=reject;pct=100;rua=mailto:postmaster@pronostic-facile.fr"
