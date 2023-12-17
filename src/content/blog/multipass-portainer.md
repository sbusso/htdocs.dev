---
title: How to replace Docker Desktop with Portainer
description: Using Multipass with Portainer on Mac and Windows
created: 2021-11-12T00:00
ogImage: /images/multipass@2x.webp
tags: ["posts", "portainer", "multipass", "docker"]
---

## Install Multipass

{% footnoteref "Multipass" "Download multipass: <a href='https://multipass.run/'>(https://multipass.run/)</a>" %}Multipass{% endfootnoteref %} is a CLI to launch and manage VMs on Windows, Mac and Linux that simulates a cloud environment with support for cloud-init.

## Create a Virtual Machine

Then we will create a new virtual machine with Portainer.

```shell
multipass launch --name ubuntu-docker --cloud-init docker.yaml
```

Here is the full description of the cloud-init file:

```yaml/*
# cloud-config.yaml
---
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh-authorized-keys:
      - ssh-rsa AAAAB3Nza....
package_update: true
packages:
  - docker
  - avahi-daemon
  - apt-transport-https
  - ca-certificates
  - curl
  - gnupg
  - lsb-release
runcmd:
  - sudo curl -fsSL https://get.docker.com | sudo bash
  - sudo systemctl enable docker
  - sudo systemctl enable -s HUP ssh
  - sudo groupadd docker
  - sudo usermod -aG docker ubuntu
  - docker volume create portainer_data
  - docker network create portainer
  - docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --net portainer\
    --restart=always -v /var/run/docker.sock:/var/run/docker.sock\
    -v portainer_data:/data portainer/portainer-ce
```
