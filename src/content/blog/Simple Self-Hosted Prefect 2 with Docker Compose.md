---
title: "Deploying Prefect with Docker Compose: A Comprehensive Guide"
author: Stephane Busso
description: Deploy Prefect using Docker Compose and some essential considerations and configuration details
published: true
tags:
  - prefect
  - python
  - docker
updated: 2024-04-01T23:45
created: 2024-03-31T10:40
cover: 
---
Prefect is a workflow orchestration system that makes it easy to build, schedule, and monitor data pipelines, monitoring complex microservices across your infrastructure. Using Prefect, you can write Python code, add decorators, and deploy your workflow to any container orchestration system, such as [Kubernetes](https://kubernetes.io/) or [Amazon Elastic Container Service (ECS)](https://aws.amazon.com/ecs/) or [Docker Swarm](https://docs.docker.com/engine/swarm/).

## Prefect Architecture
Prefect 2's architecture is modular and extensible, allowing users to customize and scale their workflows according to their specific needs.
### Prefect Server

The Prefect server is the core component of the Prefect 2 architecture. It handles workflow scheduling, state management, and coordination of workflow executions. The server exposes a REST API allowing clients (such as the Prefect UI and CLI) to interact.

The Prefect server can be deployed in various ways, such as running it locally, using Docker Compose, or deploying it on a cloud platform like AWS, GCP, or Azure. It can be scaled horizontally to handle increased workload and ensure high availability.

### Prefect UI

The Prefect UI, also known as Prefect Orion, is a web-based user interface that provides a graphical way to manage and monitor workflows. It communicates with the Prefect server's API to retrieve workflow information, display workflow status, view logs, and perform actions like starting or canceling flow runs.

The UI offers a user-friendly and intuitive interface for interacting with workflows, making it easier to visualize and control the execution of data pipelines.

###  Deployment Options

Prefect 2 provides two main options for deploying workers to execute your workflows: worker pools and custom workers using the `.serve` command.

### Option 1: Workers in Work Pools

Worker pools are a way to organize and deploy workers in Prefect 2. They allow you to define compute resources and configurations for running your workflows.

To create a worker pool using the command line, you can use the `prefect worker-pool create` command. Here's an example:

```sh
prefect worker-pool create -n my-process-pool -t process
```

This command creates a worker pool named `my-process-pool` using the `process` pool type, which runs workers as separate processes on the same machine as the Prefect server.

Prefect 2 supports several types of worker pools, including:

- `process`: Runs workers as separate processes on the same machine.
- `docker`: Runs workers in Docker containers.
- Kubernetes: Runs workers in a Kubernetes cluster.

You can customize the worker pool configuration by specifying additional options, such as the number of workers or the pool-specific settings.

To start workers in a worker pool, you can use the `prefect worker start` command with the `--pool` option:

```shell
prefect worker start --pool my-process-pool
```

### Option 2: Independent Worker Processes with `.serve` Command



### Choosing your deployment
Work pools provide a higher-level abstraction and simplify the management of compute resources. They allow you to define the desired resources and settings for your workflows, and Prefect takes care of managing the worker lifecycle within the pool. This option is suitable when you want Prefect to handle the resource management and allocation for you.

On the other hand, independent worker processes with the `.serve` command give you more control over the deployment. You can start worker processes on different machines or containers and have them independently connect to the Prefect server. This option is useful when you want to have fine-grained control over the worker deployment and scaling, or when you need to integrate with existing infrastructure or deployment processes or, ultimately, for simple deployment.
## Prefect Installation
## Prerequisites

Before diving into the deployment process, make sure you have the following prerequisites in place:

- Docker and Docker Compose installed on your system
- A database (e.g., PostgreSQL) set up and accessible

## Database Configuration

When deploying Prefect, it's essential to configure the database connection properly. Prefect supports SQLite and PostgreSQL, and in this example, we'll be using PostgreSQL. Prefect uses the asyncpg driver, so the URL needs to be specified.

To configure the database connection, you need to set the `DATABASE_URL` environment variable in the following format:

`DATABASE_URL=postgresql+asyncpg://user:password@hostname/database`

Make sure to replace `user`, `password`, `hostname`, and `database` with your actual database credentials and connection details.

Additionally, Prefect uses the `uuid-ossp` and `pg_trgm` extensions to generate UUIDs. To enable the extensions in your PostgreSQL database, execute the following SQL command:

```sql
CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION "pg_trgm";
```

## Docker Compose Configuration

Now, let's take a look at the Docker Compose configuration file for deploying Prefect:

```yaml
version: "3.9"
services:
  prefect:
    image: prefecthq/prefect:2-python3.12
    restart: always
    volumes:
      - prefect:/root/.prefect
    entrypoint: ["prefect", "server", "start"]
    environment:

      - PREFECT_SERVER_API_HOST=0.0.0.0
      - PREFECT_UI_URL=http://host:4200/api
      - PREFECT_API_URL=http://host:4200/api
      - PREFECT_API_DATABASE_CONNECTION_URL=${DATABASE_URL}
      - PREFECT_API_DATABASE_ECHO=False
      - PREFECT_API_DATABASE_MIGRATE_ON_START=True
    ports:
      - 4200:4200
      
volumes:
  prefect:
```

Make sure to replace `host` with your actual host IP address or domain name.
## Deploying Prefect

With the Docker Compose configuration in place, you can now deploy Prefect by running the following command in the same directory as the `docker-compose.yml` file:

Copy code

`docker compose up -d`

This command will start the Prefect service in detached mode, allowing it to run in the background.

Once the deployment is complete, you can access the Prefect UI by navigating to `http://host:4200` in your web browser.


## Deploy flow code into a Docker container

Out of the 2 available options to deploy a workflow we will go to the `.serve` options which provide a much easier option than the worker pool.

TBD
## Conclusion

Deploying Prefect with Docker Compose provides a convenient and reproducible way to set up your workflow management system. By following the steps outlined in this article and properly configuring your database and Docker Compose file, you can quickly get Prefect up and running.

Remember to adjust the configuration according to your specific requirements, such as modifying the database connection URL, host IP address, and any additional environment variables needed for your setup.

With Prefect deployed, we can start building and orchestrating your data pipelines, leveraging its powerful features and intuitive UI to streamline our workflow management process.