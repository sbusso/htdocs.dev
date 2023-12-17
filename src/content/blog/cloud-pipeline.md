---
title: Cloud Pipelines
description: Execute video batch and control the flow
pubDatetime: 2020-09-23
tags: ["posts", "swarm", "kubernetes", "workflow"]
---

On the way to find a way to execute video batch and control the flow, I looked at the different solutions.

Goal:

- dsd

- preferrably using containers
- lightweight: low overhead
- easy to setup and maintain: the main goal of the project is to generate videos, this is limited and simple scope, the workflow should help to facilitate the management not make it more complicated

Solutions retained:

- Airflow
- Luigi
- Argo
- Dask

### Ideal solution

Docker `Swarm` is easy to setup, `Kubernetes` much more complex, the goal is to find a way to execute jobs in a ligthweight environemnet, being able to track what is going on, trace of flow. Ideally a graphic intergfce, an easy way to define flow (yaml over python)
