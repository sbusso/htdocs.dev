---
title: Postfix - IP Rotating
pubDatetime: 2021-11-13
description: Postfix - IP Rotating
---

## 7.1. IPTable

Add the following iptable rules for ip rotation

    iptables -t nat -I POSTROUTING -m state --state NEW -p tcp --dport 25 -o eth0 -m statistic --mode nth --every 2 --packet 1 -j SNAT --to-source 144.76.113.170

    iptables -t nat -I POSTROUTING -m state --state NEW -p tcp --dport 25 -o eth0 -m statistic --mode nth --every 2 --packet 1 -j SNAT --to-source 144.76.113.185

## 7.2. Take backup of current iptable rules

    iptables-save > /etc/network/iptablerules.txt

## 7.3. Add the following line in network service configuration file(ie, /etc/network/interfaces ),

    post-up iptables-restore < /etc/network/iptablerules.txt

eg:

    auto  eth0
    iface eth0 inet static
      address   144.76.113.170
      broadcast 144.76.113.191
      netmask   255.255.255.224
      gateway   144.76.113.161

      post-up iptables-restore < /etc/network/iptablerules.txt

    # default route to access subnet

up route add -net 144.76.113.160 netmask 255.255.255.224 gw 144.76.113.161 eth0

`smtp_bind_address` directive to use multiple IPs and ip rotation can be achieved with route balancing.
