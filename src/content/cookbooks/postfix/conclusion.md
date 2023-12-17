---
title: Postfix - Conclusion
created: 2021-11-13
description: Postfix - Conclusion
---

HELO check
helocheck@cbl.abuseat.org

http://www.mail-tester.com/
avoid broken links, multi domains links
http://www.kitterman.com/spf/validate.html

https://www.blacklistmaster.com

http://postmaster.free.fr/

Big companies can send millions emails a day without trick, just following good practices

double opt-in (give email and validate)
bounce management
domain configuration; from; links
keywords

If you dont want to manage everything; we are doing it for you with MAILCHITA, first grade service for serious emailers.

Segregate IPs

Don't send bulk/marketing email from the same IPs you use to send user mail, transactional mail, alerts, etc. Each IP you send from has a reputation. By segregating your IPs according to function, you help ensure that your mail receives the best delivery possible.

If you send both promotional mail and transactional mail relating to your organization, we recommend separating mail by purpose as much as possible. You can do this by:

Using separate email addresses for each function.
Sending mail from different domains and/or IP addresses for each function.

Update: For future reference, the problem was in /etc/mailname which listed a name that wasn't in the mydestinations list of postfix. This caused all mails to be considered foreign and the mail bypassed /etc/aliases processing

Test Test Test
http://www.facilemail.fr/
http://www.port25.com/support/authentication-center/email-verification/
http://isnotspam.com/
http://spamscorechecker.com/
https://www.dnsstuff.com/member/register/
http://www.dnsgoodies.com/
http://www.debouncer.com/mx-lookup
http://dnscheck.pingdom.com/?domain=mailing.pronostic-facile.fr
http://protodave.com/security/checking-your-dkim-dns-record/
http://mxtoolbox.com/SuperTool.aspx?action=smtp%3a188.226.182.49&run=toolpage#

Resources

mailbang
mailchita
mailintouch
