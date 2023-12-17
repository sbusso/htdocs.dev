---
layout: layouts/post
title: Quick page testing with Alpine CURL
description: Using a docker image with alpine and curl to test the content of a web page
date: 2021-11-13
image: /images/curl@2x.webp
tags:
  - posts
  - docker
  - curl
  - alpine
created: 2023-11-30T23:47
updated: 2023-12-01T01:05
published: "true"
---

Used to test content of website via {% footnoteref "alpine-curl" "Docker Image: <a href='https://hub.docker.com/repository/docker/sbusso/alpine-curl'>https://hub.docker.com/repository/docker/sbusso/alpine-curl</a>" %}Alpine CURL Image{% endfootnoteref %}.

```shell
docker run --rm -e SITE='https://example.com' -e \
                   CONTENT=test sbusso/alpine-curl; echo $?
```