---
title: Kubernetes
pubDatetime: 2021-11-13
description: Kubernetes
---

## Installation

1. Digital Ocean cluster, dev mode ($30)

```
brew install kubectl
brew install doctl
```

doctl

2. Helm

```
helm repo add portainer https://portainer.github.io/k8s/
helm repo update
```

Cluster:

```
doctl kubernetes cluster kubeconfig save 85be81c7-5e23-485b-b1fc-fd9559d61694
```

kubectl create namespace portainer

Go to Kubernetes Console > services > Portainer > External Endpoints
