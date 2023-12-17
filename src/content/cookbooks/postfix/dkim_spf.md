---
title: Postfix - DKIM - SPF
pubDatetime: 2021-11-13
description: Postfix - DKIM - SPF
---

## 2.1. Install dkim related packages

    apt-get install opendkim opendkim-tools

## 2.2. Configure DKIM

Copy paste the following into a text file and save as a bash script. You can change the variables “DOMAIN” and “SELECTOR” to the one you choose depending upon the requirement.

    DOMAIN="pronostic-facile.fr"
    SELECTOR="default"

    mkdir -p /etc/opendkim/keys/${DOMAIN}
    opendkim-genkey -D /etc/opendkim/keys/${DOMAIN}/ -d ${DOMAIN} -s ${SELECTOR}
    chown -R opendkim:opendkim /etc/opendkim/keys/${DOMAIN}

    cat > /etc/opendkim/dkim-InternalHosts.txt << EOF
    ${DOMAIN}
    `hostname`
    `ifconfig |grep "inet addr:"|awk '{print $2}'|cut -d: -f2|uniq`
    EOF

    cat > /etc/opendkim.conf << EOF
    PidFile                 /var/run/opendkim/opendkim.pid
    Syslog                  yes
    Domain                  ${DOMAIN}
    KeyFile                 /etc/opendkim/keys/${DOMAIN}/${SELECTOR}.private
    Selector                ${SELECTOR}
    SyslogSuccess           yes
    LogWhy                  yes
    UserID                  opendkim:opendkim
    Umask                   002
    Canonicalization        relaxed/simple
    AutoRestart             yes
    Background              yes
    DNSTimeout              10
    Mode                    sv
    SignatureAlgorithm      rsa-sha256
    SubDomains              no
    X-Header                no
    Statistics              /var/log/dkim-filter/dkim-stats
    InternalHosts          /etc/opendkim/dkim-InternalHosts.txt
    EOF

    cat > /etc/default/opendkim << EOF
    SOCKET="inet:8891@localhost"
    EOF

    postconf -e smtpd_milters="inet:localhost:8891"
    postconf -e non_smtpd_milters="inet:localhost:8891"

    service opendkim restart
    service postfix restart

## 2.3. Update DNS

Add server ip’s 144.76.113.170 & 144.76.113.185 to spf record of domain. SPF and TXT records:

    "v=spf1 A include:aspmx.googlemail.com +ip4:5.9.20.211  ip4:144.76.113.170 ip4:144.76.113.185 include:_spf.google.com include:spf.mailjet.com include:helpscoutemail.com include:mailgun.org ~all"

Publish the contents of file /etc/opendkim/keys/pronostic-facile.fr/default.txt as a TXT record in the dns of domain.

    root@Ubuntu-1204-precise-64-minimal ~ # cat /etc/opendkim/keys/pronostic-facile.fr/default.txt

    default._domainkey IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQU...yxVM1VK9Ex+GBgO4QIDAQAB" ; ----- DKIM key default for pronostic-facile.fr

    root@Ubuntu-1204-precise-64-minimal ~ #

Ref: https://help.ubuntu.com/community/Postfix/DKIM
http://askubuntu.com/questions/134725/setup-dkim-domainkeys-for-ubuntu-postfix-and-mailman
