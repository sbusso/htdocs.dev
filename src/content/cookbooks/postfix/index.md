---
title: Postfix handbook Site
created: 2021-11-13
description: Postfix handbook Site
tags: [cookbooks, postfix]
---

This is a compiled documentation to administrate a Postfix server for outgoing email

!!! danger "Disclaimer"
This setup documentation was realised on Ubuntu 12.04 and would need update for more recent ubuntu and Postfix

This documentation is a compilation of information gathered over the years to build an outgoing mail server with postfix. This is not aiming to be a all go configuration and open sourced for contribution.

## Main Sections

A concise guide. If you just want a robust outgoing mail server, you don't need to spend $4500 in a PowerMTA solution. Here we show you how to setup your own SMTP, spam filter proof able to send 300 000 email an hour.

Ubuntu 12.04.4 LTS

1. Installation: installation.md
2. DKIM and SPF: dkim_spf.md
3. DomainKeys: domainkeys.md
4. Open DMARC: opendmarc.md
5. Bounce Management: bounce.md
6. Rate Limiting: rate_limiting.md
7. IP Rotating: ip_rotating.md
8. Authentication: authentication.md
9. Multidomain: multidomain.md
10. Whitelisting: whitelisting.md
11. Advanced Setup: advanced_setup.md
12. Monitoring: monitoring.md
13. Conlusion and Tips: conclusion.md
