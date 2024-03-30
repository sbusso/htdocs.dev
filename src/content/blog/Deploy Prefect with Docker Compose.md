---
title: "Deploying Prefect with Docker Compose: A Comprehensive Guide"
author: Stephane Busso
description: Deploy Prefect using Docker Compose and some essential considerations and configuration details
published: true
tags:
  - prefect
  - python
  - docker
updated: 2024-03-31T11:06
created: 2024-03-31T10:40
cover: 
---
Prefect is a powerful workflow management system that makes it easy to build, schedule, and monitor data pipelines. I haven't found a comprehensive guide on how to host Prefect with Docker Compose, so in this article, I will share the steps to deploy Prefect using Docker Compose and point out some essential considerations and configuration details.

## Prerequisites

Before diving into the deployment process, make sure you have the following prerequisites in place:

- Docker and Docker Compose installed on your system
- A database (e.g., PostgreSQL) set up and accessible

## Database Configuration

When deploying Prefect, it's essential to configure the database connection properly. Prefect supports SQLite and PostgreSQL, and in this example, we'll be using PostgreSQL. Prefect uses the asyncpg driver, so the URL needs to be specified.

To configure the database connection, you need to set the `DATABASE_URL` environment variable in the following format:

`DATABASE_URL=postgresql+asyncpg://user:password@hostname/database`

Make sure to replace `user`, `password`, `hostname`, and `database` with your actual database credentials and connection details.

Additionally, Prefect uses the `uuid-ossp` extension to generate UUIDs. To enable this extension in your PostgreSQL database, execute the following SQL command:

```sql
CREATE EXTENSION "uuid-ossp";
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

## Conclusion

Deploying Prefect with Docker Compose provides a convenient and reproducible way to set up your workflow management system. By following the steps outlined in this article and properly configuring your database and Docker Compose file, you can quickly get Prefect up and running.

Remember to adjust the configuration according to your specific requirements, such as modifying the database connection URL, host IP address, and any additional environment variables needed for your setup.

With Prefect deployed, we can start building and orchestrating your data pipelines, leveraging its powerful features and intuitive UI to streamline our workflow management process.