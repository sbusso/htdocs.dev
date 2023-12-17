---
title: Postfix - Bounce
pubDatetime: 2021-11-13
description: Postfix - Bounce
---

Soft vs Hard

Specify postfix to send all bounce emails to email address 'bounce@pronostic-facile.fr' in /etc/postfix/main.cf

    postconf -e "notify_classes=bounce,resource,software"
    postconf -e "bounce_notice_recipient=bounce@pronostic-facile.fr"
    postconf -e "transport_maps=regexp:/etc/postfix/transport"
    postfix reload

As we want to bounce emails to go to 'bounce@pronostic-facile.fr' in cpanel server, we need to add the following in /etc/postfix/transport

    /bounce.*/ smtp:ASPMX.L.GOOGLE.COM:25

To forward to google apps and not local in /etc/postfix/transport

    /pronostic-facile\.fr/ relay:[ASPMX.L.GOOGLE.COM]
