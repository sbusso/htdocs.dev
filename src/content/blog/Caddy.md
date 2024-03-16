---
created: 2024-03-16T23:35
updated: 2024-03-16T23:54
title: Caddy as a reverse proxy for Docker
description: How to setup caddy as a reverse proxy with docker standalone and docker swarm.
published: true
tags:
  - docker
  - caddy
---
How to setup caddy as a reverse proxy with docker standalone and docker swarm.

Caddy service:

```yml
version: "3.9"
services:
  caddy:
    image: lucaslorentz/caddy-docker-proxy:ci-alpine
    ports:
      - 80:80
      - 443:443
    environment:
      - CADDY_INGRESS_NETWORKS=caddy
      - CADDY_DNS= ${token} cloudflare
    networks:
      - caddy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - caddy_data:/data
    restart: unless-stopped
    labels: # Global options
      caddy.email: stephane@kyr.sh

networks:
  caddy:
    external: true

volumes:
  caddy_data: {}
```


```yml
# swarm
deploy:
    labels:
        caddy: <url>
        caddy.reverse_proxy: "{{upstreams <UPSTREAM_PORT>}}"

networks:
  caddy:
    external: true
```

```yml
# standalone

labels:
    caddy: <url>
    caddy.reverse_proxy: "{{upstreams <UPSTREAM_PORT>}}"

networks:
  caddy:
    external: true
```