---
title: Concepts
pubDatetime: 2021-11-13
description: Kubernetes concepts
---

Before diving in, let's look at some of the basic building blocks that you have to work with from the Kubernetes API:

- A Node is a worker machine provisioned to run Kubernetes. Each Node is managed by the Kubernetes master.
- A Pod is a logical, tightly-coupled group of application containers that run on a Node. Containers in a Pod are deployed together and share resources (like data volumes and network addresses). Multiple Pods can run on a single Node.
- A Service is a logical set of Pods that perform a similar function. It enables load balancing and service discovery. It's an abstraction layer over the Pods; Pods are meant to be ephemeral while services are much more persistent.
- Deployments are used to describe the desired state of Kubernetes. They dictate how Pods are created, deployed, and replicated.
- Labels are key/value pairs that are attached to resources (like Pods) which are used to organize related resources. You can think of them like CSS selectors. For example:
- Environment - dev, test, prod
- App version - beta, 1.2.1
- Type - client, server, db
- Ingress is a set of routing rules used to control the external access to Services based on the request host or path.
- Volumes are used to persist data beyond the life of a container. They are especially important for stateful applications like Redis and Postgres.
- A PersistentVolume defines a storage volume independent of the normal Pod-lifecycle. It's managed outside of the particular Pod that it resides in.
- A PersistentVolumeClaim is a request to use the PersistentVolume by a user.
