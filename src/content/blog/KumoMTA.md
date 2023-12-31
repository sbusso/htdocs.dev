---
created: 2023-12-13T08:41
updated: 2023-12-19T23:41
published: true
description: KumoMTA is a new (as of the end of 2023) solution for a high-volume, high-performance, on-premise email-sending platform. It is designed with a modern architecture mindset, mixing Rust and Lua for high performance and configurability.
title: KumoMTA
featured: false
tags:
  - smtp
  - tutorial
  - kumomta
  - postfix
---

For 15 years or so, Postfix has been my solution for sending out marketing emails. Always on the lookout for something a bit more flexible and user-friendly. And then KumoMTA comes along!

KumoMTA is a new (as of the end of 2023) solution for a high-volume, high-performance, on-premise email-sending platform. It is designed with a modern architecture mindset, mixing Rust and Lua for high performance and configurability.

The Open Source project Email Service Providers don't want you to know about. Some pricey, big-name products out there (looking at you, PowerMTA) should be sweating bullets right now.

## Features

- Use Lua as a configuration language.
- Delivery to SMTP and HTTP
- Events and metrics export
- Extensive documentation and tutorials

## First, What is an MTA?

An MTA, or Mail Transfer Agent, is a key part of how emails are sent over the Internet. In the context of SMTP, which stands for Simple Mail Transfer Protocol, the MTA acts like a mailman for emails. When you send an email, it first goes to an SMTP server. Working as an MTA, this server figures out where the email needs to go efficiently.

When you send an email, it first hits an SMTP server, which acts as the MTA. The MTA’s job is finding the best email delivery path. It looks up the recipient's email server using DNS (a system that matches email addresses with server locations) and then forwards your email there.

Beyond just routing emails, MTAs have several important responsibilities, particularly in high-volume email sending scenarios:

1. **Performance**: MTAs are designed to handle a large number of emails quickly and efficiently. They must process and forward emails without significant delays, ensuring timely delivery.

2. **Managing Delivery Queues**: If an email can't be delivered immediately, the MTA places it in a queue. The MTA then periodically attempts to resend these queued emails. This queuing system is crucial for handling delivery issues and maintaining email flow.

3. **Adjusting Delivery for ESP Policies**: Different Email Service Providers (ESPs) have their own rules and limitations (like limits on the number of emails sent per hour). MTAs are smart enough to adjust their delivery tactics to comply with these various ESP policies, which helps avoid emails being marked as spam or rejected.

4. **Security and Compliance**: MTAs also play a role in maintaining the security of the emails transmitted. They may include features like encryption to protect the content of emails during transfer. This is becoming even more important in 2024: [New Gmail protections for a safer, less spammy inbox](https://blog.google/products/gmail/gmail-security-authentication-spam-protection/)

In essence, an MTA in an SMTP environment is more than just a simple mail forwarder. It ensures not only the efficient and secure delivery of emails but also manages complex delivery scenarios and compliance with various ESP rules, making it an indispensable tool for email communication such as marketing campaigns.

## Setup

### Installing Rocky Linux 9

For the setup I will use Proxmox, but you can use any VPS or dedicated server following the recommended specs 4 cores, 8 Gb memory, 12Gb disk.

Download ISO image Rocky Linux 9 minimal

```
https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-minimal.iso
```

Launch the OS install and follow the instructions.

### Post-installation

Disable postfix and qpidd:

```sh
sudo dnf clean all
sudo dnf update -y
sudo systemctl stop postfix.service
sudo systemctl disable postfix.service
sudo systemctl stop qpidd.service
sudo systemctl disable qpidd.service
```

Install extra packages

```sh
# Grab some handy tools
sudo dnf install -y wget bind bind-utils telnet firewalld

sudo systemctl start named
sudo systemctl enable named
```

setup auto update packages

```sh
echo "0 3 * * * root /usr/bin/dnf update -y >/dev/null 2>&1" | sudo tee /etc/cron.d/dnf-updates >/dev/null
```

Optional: rocksdb for spool management

```sh
sudo dnf makecache
sudo dnf install rocksdb.x86_64
```

#### Firewall

Select the correct network interface. You can list existing interfaces with `eth0` for a VPS, but in `ens18` in Proxmox. Do check the right interface, your case may vary and the MTA setup won't work without the right config.

```sh
firewall-cmd --list-interfaces
# eht0
```

```sh
sudo echo "ZONE=public" | sudo tee -a /etc/sysconfig/network-scripts/ifcfg-eth0

sudo systemctl stop firewalld
sudo systemctl start firewalld.service
sudo firewall-cmd --set-default-zone=public
sudo firewall-cmd --zone=public --change-interface=eth0
sudo firewall-cmd --zone=public --permanent --add-service=http
sudo firewall-cmd --zone=public --permanent --add-service=https
sudo firewall-cmd --zone=public --permanent --add-service=ssh
sudo firewall-cmd --zone=public --permanent --add-service=smtp
sudo firewall-cmd --zone=public --permanent --add-port=587/tcp

sudo systemctl enable firewalld
sudo firewall-cmd --reload
```

### SSL Certificate

```sh
# For the certificate enter your FQDN
MYFQDN="kyr.sh"

# For the certificate, what country code are you in? (CA,US,UK, etc)
CERT_CO=US

# For the certificate, what State or Province are you in? (Alberta, California, etc)"
CERT_ST="California"

# For the certificate, what city are you in? (Edmonton, Houston, etc)"
CERT_LO="Los Angeles"

# For the certificate, what is the name of your company or organization"
CERT_ORG="Nuibits LTD"

# Generate private key
openssl genrsa -out ca.key 2048

# Generate CSR
openssl req -new -key ca.key -out ca.csr -subj "/C=$CERT_CO/ST=$CERT_ST/L=$CERT_LO/O=$CERT_ORG/CN=$MYFQDN/"

# Generate Self Signed Key
openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt

# Copy the files to the correct locations
sudo mv -f ca.crt /etc/pki/tls/certs
sudo mv -f ca.key /etc/pki/tls/private/ca.key
sudo mv -f ca.csr /etc/pki/tls/private/ca.csr
```

## KumoMTA setup

Install KumoMTA packages

```sh
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager \
    --add-repo \
    https://openrepo.kumomta.com/files/kumomta-rocky.repo
sudo yum install kumomta
```

On `13/11` the production installation is `kumomta-2023.11.28.115529_b5252a41-1.rocky9.2.x86_64.rpm`.

The instructions above will place a default configuration file at `/opt/kumomta/etc/policy/init.lua` and start the KumoMTA service. If the service does not start by default, it can be started and enabled with the following commands:

```sh
sudo systemctl start kumomta
sudo systemctl enable kumomta
```

KumoMTA will now be installed and running the `init.lua` configuration from `/opt/kumomta/sbin/kumod`

## Tuning sysctl.conf

The following tuning parameters can help KumoMTA fully leverage its host server resources.

These parameters should be added or updated in */etc/sysctl.conf*:

```toml
vm.max_map_count = 768000
net.core.rmem_default = 32768
net.core.wmem_default = 32768
net.core.rmem_max = 262144
net.core.wmem_max = 262144
fs.file-max = 250000
net.ipv4.ip_local_port_range = 5000 63000
net.ipv4.tcp_tw_reuse = 1
kernel.shmmax = 68719476736
net.core.somaxconn = 1024
vm.nr_hugepages = 20
kernel.shmmni = 4096
```

After editing, the changes can be implemented without a restart with the sysctl -p command.

## Configuration

1. `init.lua`
   1. relay host
   2. http listener
2. `shaping.toml`
3. `listener_domains.toml` accept incoming bounce notifications and Feedback Lopp messages
4. `sources.toml` Egress Sources and Pools- [ ] #todo
5. DKIM and `dkim_data.toml`

```sh
export DOMAIN=nuibits.com
export SELECTOR=_kmdomainkey
sudo mkdir -p /opt/kumomta/etc/dkim/$DOMAIN
sudo openssl genrsa -f4 -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key 1024
sudo openssl rsa -in /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key -outform PEM -pubout -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.pub
sudo chown kumod:kumod /opt/kumomta/etc/dkim/$DOMAIN -R
```

[KumoMTA Configuration](#) [TODO]

As you are setting up the DNS record, one more record

#### Add DMARC record

```
_dmarc.smtp.kyr.sh TXT v=DMARC1; p=none; rua=mailto:dmarc-reports@smtp.kyr.sh
```

## Monitoring

In an upcoming post, I will go through setting up Graylog for events and logs monitoring and Prometheus for metrics.

- KumoMTA config to export logs to RabbitMQ
- Graylog's Configuration to extract data and alerts
- Setup Prometheus node exporter
- Connect to Prometheus
- Configure Grafana

## Conclusion

It has excellent documentation and modern patterns, and it is the best in the class using Lua and Rust. Globally, it is relatively easy to set up due to good documentation. It is sending focused, best practices.

We can feel the experience behind building and managing mail service. Modern design, there is no-nonsense,

NB: This was written in December 2023 and will be regularly updated. This is heavily based on the fantastic documentation from [KumoMTA](https://docs.kumomta.com/tutorial/quickstart/), with some specific data and the whole process required to get up and running. Refer to the official documentation to ensure up-to-date information, as the platform is still in the early days and actively developed.
