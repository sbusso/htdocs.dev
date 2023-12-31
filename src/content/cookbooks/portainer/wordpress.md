---
title: Wordpress hosting with Docker and Portainer
created: 2021-11-13T00:00
description: Wordpress hosting with Docker and Portainer
---

EasyEngine did switch from installing php stack directly to the system to use docker images to create the different environments, but using command line. Using Portainer, we can skip those steps and manage deployment directly from the interface and control everything. But first we need to setup the system:

## System installation

Create a VPS with Ubuntu 20.04 LTS

### Install webmin/virtualmin

(optional)

```shell
	wget https://software.virtualmin.com/gpl/scripts/install.sh
	sudo /bin/sh install.sh
```

### Install Portainer

(required)

```shell
	apt update
	apt upgrade
	apt install docker.io
	docker volume create portainer_data
	docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```

## Setup layers

### Network

We need 2 network, one to deal with outside world, managed by traefik, and another one for backend communication with the dabatabse, not accessible from outside will be created by each stack.

```
docker create network -d bridge traefik
```

Each stack will create their own network.

Or directly in the UI:

Then we need to install 2 pieces of infra: the router / load blancer, Treafik, and the datbase mariadb.

### traefik

At the moment portainer only accept docker compose v2 definition

```yaml
version: "2"

services:
  traefik:
    image: "traefik:v2.3"
    container_name: "traefik"
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web-secure.address=:443"
      - "--certificatesresolvers.myhttpchallenge.acme.httpchallenge=true"
      - "--certificatesresolvers.myhttpchallenge.acme.httpchallenge.entrypoint=web"
      - "--pilot.token=df5c63a6-9fc1-4253-9c36-62f0ed4548c1"
      - "--certificatesresolvers.myhttpchallenge.acme.email=stephane.busso@gmail.com"
      - "--certificatesresolvers.myhttpchallenge.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "/etc/letsencrypt:/letsencrypt"
    networks:
      - traefik

networks:
  traefik:
    external:
      name: traefik
```

### Wordpress stack

```yaml
version: "2"

services:
  db:
    image: mariadb:latest
    volumes:
      - /var/lib/mysql:/var/lib/mysql:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: PASSWORD
      MYSQL_DATABASE: WP
      MYSQL_USER: WPUSER
      MYSQL_PASSWORD: WPPASSWD
    networks:
      - backend
  wordpress:
    depends_on:
      - db
    image: wordpress # wordpress with apache
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: WPUSER
      WORDPRESS_DB_PASSWORD: WPPASSWD
    networks:
      - traefik
      - backend
    labels:
      # The labels are usefull for Traefik only
      - "traefik.enable=true"
      - "traefik.docker.network=traefik_default"
      # Get the routes from http
      - "traefik.http.routers.${SERVICE}.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.${SERVICE}.entrypoints=web"
      # Redirect these routes to https
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"
      - "traefik.http.routers.${SERVICE}.middlewares=redirect-to-https@docker"
      # Get the routes from https
      - "traefik.http.routers.${SERVICE}-secured.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.${SERVICE}-secured.entrypoints=web-secure"
      # Apply autentificiation with http challenge
      - "traefik.http.routers.${SERVICE}-secured.tls=true"
      - "traefik.http.routers.${SERVICE}-secured.tls.certresolver=myhttpchallenge"
volumes:
  db_data:

networks:
  traefik:
    external:
      name: traefik
  backend:
```

_Voilà_, after few minutes (time for traefik to get certificates) you should be able to access wordpress at the address in `DOMAIN`

## Conclusion

What I have learned, it is not always good to optimise things,different paradigm, containers have to keep simple and indempotent, 1 database per stack instead of 1 central and fpm vs apache/php was too complex to operate.
