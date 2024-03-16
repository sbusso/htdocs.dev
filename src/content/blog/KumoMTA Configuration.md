---
created: 2023-12-14T11:01
updated: 2024-03-16T23:50
tags:
  - smtp
  - type/article
description: KumoMTA uses Lua in place of a more traditional formatted configuration file.
title: KumoMTA Configuration
published: true
---
KumoMTA uses Lua in place of a more traditional formatted configuration file.

Lua is a surprisingly powerful configuration language, allowing you to either statically define configuration or dynamically build it by pulling from multiple data sources.
## Helpers
In order to make KumoMTA more accessible for those who are accustomed to a static configuration file and don't need deeper integration, we have developed a set of policy helpers. These helpers are premade Lua policy scripts that implement common use cases by reading formatted TOML and JSON files to configure KumoMTA.
## Concepts

![CleanShot 2023-12-19 at 10.58.28@2x.png](/assets/CleanShot%202023-12-19%20at%2010.58.28@2x.png)
## Init script
Configuration starts in `/opt/kumomta/etc/policy/init.lua`, and we will use the [example](https://docs.kumomta.com/userguide/configuration/example/) provided in the documentation as a starting point.

1. ✅ setup sources _`sources.toml`_ sending IP addresses
2. ✅ setup `dkim_signer` _`dkim_data.toml`_
3. ✅ setup automation traffic `shaper` _`shaping.toml`_ (ESP policies)
4. log hooks 
5. ✅ setup queue management _`queues.toml`_
6. Events:
	1. init
		1. storage: data, metadata, logs
		2. `shaper`
		3. bounce
		4. HTTP listener
		5. SMTP listener
	2. ✅ get_listener_domain _`listener_domains.toml`_ for relay, oob bounces, and FBLs messages
	3. egress path  from `shaper`
	4. smtp message receive: queue, `dkim_signer`

### `sources.toml`
### DKIM and `dkim_data.toml`

selector: `s1`

`s1._domainkey.smtp.kyr.sh`

```sh
export DOMAIN=smtp.kyr.sh
export SELECTOR=s1
sudo mkdir -p /opt/kumomta/etc/dkim/$DOMAIN
sudo openssl genrsa -f4 -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key 1024
sudo openssl rsa -in /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.key -outform PEM -pubout -out /opt/kumomta/etc/dkim/$DOMAIN/$SELECTOR.pub
sudo chown kumod:kumod /opt/kumomta/etc/dkim/$DOMAIN -R
```

Add a `TXT` record to DNS with the content:

`v=DKIM1; k=rsa; h=sha256; p=MIbBa...DaQAB`

`dkim_data.toml`

### Automation shaper
The shaping lua helper will include the community managed https://github.com/KumoCorp/kumomta/blob/main/assets/policy-extras/shaping.toml
### Queues

### Listener domains



