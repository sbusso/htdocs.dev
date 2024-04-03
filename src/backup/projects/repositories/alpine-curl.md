---
title: Alpine Curl
created: 2021-11-13T00:00
description: Alpine Curl
---

Used to test content of website via curl

```
docker run --rm -e SITE='https://example.com' -e \
                   CONTENT=test sbusso/alpine-curl; echo $?
```

github: https://github.com/sbusso/alpine-curl

docker: https://hub.docker.com/repository/docker/sbusso/alpine-curl
