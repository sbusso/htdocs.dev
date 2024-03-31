---
title: "Deploying Prefect with Docker Compose: A Comprehensive Guide"
author: Stephane Busso
description: Deploy Prefect using Docker Compose and some essential considerations and configuration details
published: true
tags:
  - prefect
  - python
  - docker
updated: 2024-03-31T20:26
created: 2024-03-31T10:40
cover: 
---
Prefect is a workflow orchestration system that makes it easy to build, schedule, and monitor data pipelines, monitoring complex microservices across your infrastructure. Using Prefect, you can write Python flows that you [package and deploy as Docker containers](https://docs.prefect.io/latest/guides/docker/). You can then run this flow on any container orchestration system, such as [Kubernetes](https://kubernetes.io/) or [Amazon Elastic Container Service (ECS)](https://aws.amazon.com/ecs/) or [Docker Swarm](https://docs.docker.com/engine/swarm/).
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


## ### Package flow code into a Docker container

Let's see how this works in practice. First, create a file containing the actions you’ll automate using Prefect flows. You can place the following code snippets in a file called

### Create a work pool for our Docker container
On Prefect, a flow runs on a **work pool**. A work pool organizes your flow runs and points to the backend compute that Prefect will use to run your flow. Configuring a work pool enables you to use dynamic infrastructure - e.g., ephemeral containers - instead of running dedicated infra for your flows.

For Docker containers, Prefect supports two methods for configuring work pools:

- Use a **serverless [push work pool](https://docs.prefect.io/latest/guides/deployment/push-work-pools/)**. In a push work pool, Prefect automates creating the required cloud infrastructure to run worker containers in your cloud account. That eliminates the need to pre-provision compute via a separate deployment.
- Create **a work pool that runs on your own infrastructure** - e.g., your own existing Amazon ECS cluster, GKS cluster, etc. Use this option if you have custom configuration requirements.
- Create a [**managed work pool**](https://docs.prefect.io/latest/guides/managed-execution/). Prefect will create the work pool plus the cloud capacity for you on our own backend cloud infrastructure. This frees you from having to manage any computing resource - Prefect does all the work for you, from soup to nuts.

Let’s walk through creating a push work pool for the above task. To create a Prefect work pool for ECS, install the AWS CLI and set up your credentials using [aws configure](https://docs.aws.amazon.com/cli/latest/reference/configure/). This is required so that Prefect can create infrastructure in your AWS account.

- Next, [create a Prefect account](https://app.prefect.cloud/?deviceId=b873fa8c-f08c-49d2-9170-bdec573c8eb1) (if you don’t have one).
- Then, [install Prefect](https://docs.prefect.io/latest/getting-started/installation/) and its associated command-line tools locally using pip: pip install -U prefect
- Login to Prefect with the following command: prefect cloud login
- Next, create a work pool like so: prefect work-pool create --type ecs:push --provision-infra document-verification-pool

Here, document-verification-pool is the name of the work pool as it’ll appear in your push work pools list in Prefect. The --provision-infra flag means that Prefect will automatically provision necessary infrastructure and create a new push work pool.

After asking whether you want to customize your resource names, Prefect will describe the resources it’ll create in your account and then ask if you want to create them. These include IAM roles and users for managing ECS tasks, an IAM policy, an Amazon Elastic Container Registry (ECR) instance to store your container images, and an ECS cluster for running your images.

![](https://www.prefect.io/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F3ugk85nk%2Fproduction%2F6d253dc6466e243d2632293b0c9f2a6a19d2aaf5-957x408.png%3Ffit%3Dmax%26auto%3Dformat&w=3840&q=75)

### Create a deployment for our flow

Now that you’ve created a work pool, you need to create a [**deployment**](https://docs.prefect.io/latest/concepts/deployments/?h=deployment) for your flow. While flows can be run locally (e.g., from your dev machine), you need to deploy a flow to Prefect Cloud in order to trigger it from an external process via a webhook.

First, create a deployment by using a Dockerfile to create a customized Docker image that’ll run your code. Save the following code to a file named Dockerfile in the same directory as your flow code:

```shell
1# We're using the latest version of Prefect with Python 3.10
2FROM prefecthq/prefect:2-python3.10
3# Add our requirements.txt file to the image and install dependencies
4COPY requirements.txt .
5RUN pip install -r requirements.txt --trusted-host pypi.python.org --no-cache-dir
```

This Dockerfile uses the base Prefect image. It adds a couple of commands to install the dependent packages your Python code requires. Before running this, you’ll need to create a requirements.txt file in the same directory with the following contents: boto3, requests, psycopg2-binary.

Next, replace __main__ in document_verification.py with the following code that creates a Docker-based deployment:

```python
1from prefect.deployments import DeploymentImage
2
3...
4
5if __name__ == "__main__":
6		document_verification.deploy(
7				name="document-verification-deployment",
8				work_pool_name="document-verification-pool",
9				image=DeploymentImage(
10						name="prefect-flows:latest",
11						platform="linux/amd64",
12						dockerfile=”.Dockerfile”
13				)
14		)
```

Run this file on the command line using: python document_verification.py

You should see the following output:

![](https://www.prefect.io/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F3ugk85nk%2Fproduction%2F9b70f1cff17318ce50e94f75fa740466b8ac6b9f-957x327.png%3Ffit%3Dmax%26auto%3Dformat&w=3840&q=75)

Soooo let me pause and explain, because there’s a little magic happening here.

When you ran the prefect work-pool create command above, Prefect created both an Amazon ECS cluster as well as an Amazon ECR cluster on your behalf. After you ran this command, it automatically logged you into your ECR repo and made it the default for Docker container builds and pushes.

Note: If your login to your ECR repository expires (which it will, eventually), you can use the standard get-login-password AWS CLI command to refresh it: aws ecr get-login-password --region _aws-region_ | docker login --username AWS --password-stdin _aws-account-number_.dkr.ecr._aws-region_.amazonaws.com

In the Python code you added, the **deploy()** method creates a new deployment using the **DeploymentImage** class. This built the image on your behalf, pushed it to your ECR repository in your AWS account, and made it the target container image for your deployment. Whenever you trigger this deployment, it’ll run your flow code in an instance of this Docker image.

The end result is that you should see a new deployment in the Prefect Cloud UI:

## Conclusion

Deploying Prefect with Docker Compose provides a convenient and reproducible way to set up your workflow management system. By following the steps outlined in this article and properly configuring your database and Docker Compose file, you can quickly get Prefect up and running.

Remember to adjust the configuration according to your specific requirements, such as modifying the database connection URL, host IP address, and any additional environment variables needed for your setup.

With Prefect deployed, we can start building and orchestrating your data pipelines, leveraging its powerful features and intuitive UI to streamline our workflow management process.