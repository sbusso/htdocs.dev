---
created: 2023-12-13T08:41
updated: 2023-12-18T09:22
published: true
description: KumoMTA is a new (as of the end of 2023) solution for a high-volume, high-performance, on-premise email-sending platform. It is designed with a modern architecture mindset, mixing Rust and Lua for high performance and configurability.
title: KumoMTA
featured: true
---

For 15 years or so, Postifx has been my solution for sending out marketing emails. Always on the lookout for something a bit more flexible and user-friendly. And then KumoMTA comes along!

KumoMTA is a new (as of the end of 2023) solution for a high-volume, high-performance, on-premise email-sending platform. It is designed with a modern architecture mindset, mixing Rust and Lua for high performance and configurability. 

The Open Source project Email Service Providers don't want you to know about. There are some pricey, big-name products out there that should be sweating bullets right now.
## Features
- Extensive documentation and tutorials
- Use Lua as a configuration language.
- Delivery to HTTP

Other: Monitoring with Prometheus
## Proxmox setup
### Installing Rocky Linux 9
Download ISO image Rocky Linux 9 minimal`https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-minimal.iso`

4 cores, 8 Gb memory, 12Gb disk

Start the VM and follow the install instructions.
### Post-installation

Disable postfix

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

setup autoupdate packages

```sh
echo "0 3 * * * root /usr/bin/dnf update -y >/dev/null 2>&1" | sudo tee /etc/cron.d/dnf-updates >/dev/null
```

Optional: rocksdb for spool management

```sh
sudo dnf makecache
sudo dnf install rocksdb.x86_64
```
#### Firewall
Select the correct network interface, you can list existing interfaces wirth:

```sh
firewall-cmd --list-interfaces
# ens18
```


```sh
sudo echo "ZONE=public
" | sudo tee -a /etc/sysconfig/network-scripts/ifcfg-eth0

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

On 13/11 the production installation is `kumomta-2023.11.28.115529_b5252a41-1.rocky9.2.x86_64.rpm`.

The instructions above will place a default configuration file at `/opt/kumomta/etc/policy/init.lua` and start the KumoMTA service, if the service does not start by default, it can be started and enabled with the following commands:

```sh
sudo systemctl start kumomta 
sudo systemctl enable kumomta
```

KumoMTA will now be installed and running the `init.lua` configuration from `/opt/kumomta/sbin/kumod`

## Tuning sysctl.conf
The following tuning parameters can help KumoMTA fully leverage its host server resources.

These parameters should be added or updated in _/etc/sysctl.conf_:

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
5. DKIM
```sh
export DOMAIN=nuibits.com
export SELECTOR=_kmdomainkey
sudo mkdir -p /opt/kumomta/etc/dkim/$DOMAIN
sudo openssl genrsa -f4 -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key 1024
sudo openssl rsa -in /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key -outform PEM -pubout -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.pub
sudo chown kumod:kumod /opt/kumomta/etc/dkim/$DOMAIN -R
```
1. `dkim_data.toml`

[KumoMTA Configuration](KumoMTA%20Configuration.md)
## Management
![CleanShot 2023-12-13 at 09.53.17@2x.png](../../assets/CleanShot%202023-12-13%20at%2009.53.17@2x.png)

```sh
sudo /opt/kumomta/sbin/tailer --tail /var/log/kumomta
```

add `/opt/kumomta/sbin` to `$PATH`

## Monitoring
- Setup Prometheus node exporter
- Connect to prometheus
- Configure Grafana


## Conclusion
Has amazing documentation and modern patterns, and it is the best in the class using Lua and Rust. Globally, it is relatively easy to set up due to good documentation. Sending focused, best practices.

We can really feel the experience behind building and managing mail service. Modern design, there is no non sense, 

DISCLAIMER: This was written in December 2023 and regularly updated. This is heavily based on the fantastic documentation from KumoMTA, with some specific data and the whole process required to get up and running. Do refer to the official documentation, which will evolve with development.


![CleanShot 2023-12-14 at 19.59.11@2x.png](../../assets/CleanShot%202023-12-14%20at%2019.59.11@2x.png)

![CleanShot 2023-12-14 at 19.59.27@2x.png](../../assets/CleanShot%202023-12-14%20at%2019.59.27@2x.png)



## Bounce command

```bash
kcli bounce --everything --reason clean
```

> [!warning]
> Everytime this command is used, we cannot send any more mail
### Add DMARC record

`_dmarc.smtp.kyr.sh` TXT v=DMARC1; p=none; rua=mailto:dmarc-reports@smtp.kyr.sh


### Test

```sh
swaks --from contact@smtp.kyr.sh --to sbusso-KHLV@srv1.mail-tester.com --ehlo smtp.kyr.sh --server localhost:2525 --body body.txt
```