---
created: 2023-12-06T16:46
updated: 2023-12-06T17:10
tags:
  - type/note
published: "true"
---

Portainer CE doesn't provide a facilitated way to add a GitHub registry and requires the use of a custom one.
- `registry url`: `ghcr.io/<organisation>`
- `username`: github username
- `password`: personal token with packages full access

![CleanShot 2023-12-06 at 16.49.09@2x.png](../../assets/images/CleanShot%202023-12-06%20at%2016.49.09@2x.png)

When creating a container, choose the registry created and append the package name and tag:

![CleanShot 2023-12-06 at 17.09.32@2x.png](../../assets/images/CleanShot%202023-12-06%20at%2017.09.32@2x.png)