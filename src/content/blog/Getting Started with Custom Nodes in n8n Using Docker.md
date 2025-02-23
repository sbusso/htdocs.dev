---
title: Getting Started with Custom Nodes in n8n Using Docker
author:
  - Stephane Busso
description: n8n is a powerful workflow automation tool that allows you to create automation between different services and APIs. Sometimes, n8n’s built-in nodes might not cover all your needs, and that’s where custom nodes come into play. Custom nodes allow you to extend n8n’s capabilities by writing your own functionality. In this guide, we will cover how to set up a custom node for n8n and run it using Docker.
published: true
tags:
  - docker
  - n8n
updated: 2025-02-23T14:33
created: 2025-02-23T14:32
cover: 
---
n8n is a powerful workflow automation tool that allows you to create automation between different services and APIs. Sometimes, n8n’s built-in nodes might not cover all your needs, and that’s where custom nodes come into play. Custom nodes allow you to extend n8n’s capabilities by writing your own functionality. In this guide, we will cover how to set up a custom node for n8n and run it using Docker.
Table of Contents

    Prerequisites
    Project Setup
    Creating the Custom Node
        1. Initialize the Node Project
        2. Create the Node Files
        3. Write the Node Code
        4. Compile the TypeScript Code
    Docker Setup
        1. Create a Dockerfile
        2. Create a Docker Compose File
    Running n8n with Your Custom Node
    Using Your Custom Node in n8n
    Conclusion
    Additional Resources

Prerequisites

Before you begin, ensure you have the following installed on your machine:

    Node.js and npm: For developing and building the custom node.
    TypeScript: As custom nodes are written in TypeScript.
    Docker and Docker Compose: For running n8n in a containerized environment.
    Basic Knowledge of JavaScript/TypeScript and Docker: Understanding of these technologies will help you follow along.

Project Setup

    Create a Project Directory: Start by creating a new directory for your project.

    mkdir n8n-custom-node
    cd n8n-custom-node

Creating the Custom Node
1. Initialize the Node Project

We’ll create a new Node.js project for our custom node.

mkdir custom-nodes
cd custom-nodes
npm init -y

This will create a package.json file in the custom-nodes directory.
2. Create the Node Files

Create the following files in the custom-nodes directory:

    MyCustomNode.node.ts: The main TypeScript file for your custom node.
    tsconfig.json: TypeScript configuration file.
    index.ts: Entry point to export your node.

touch MyCustomNode.node.ts tsconfig.json index.ts

3. Write the Node Code
tsconfig.json

Configure the TypeScript compiler options.

{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2019",
    "lib": ["es2019"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["MyCustomNode.node.ts"],
  "exclude": ["node_modules"]
}

package.json

Add the necessary dependencies and scripts.

{
  "name": "my-custom-node",
  "version": "1.0.0",
  "description": "A custom node for n8n",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^14.14.37",
    "n8n-workflow": "^0.128.0",
    "typescript": "^4.2.4"
  },
  "dependencies": {}
}

Install the dependencies:

npm install

MyCustomNode.node.ts

Write a simple custom node that, for example, reverses a string input.

import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    group: ['transform'],
    version: 1,
    description: 'A custom node that reverses a string',
    defaults: {
      name: 'My Custom Node',
      color: '#1F8EB2',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'String to Reverse',
        name: 'stringToReverse',
        type: 'string',
        default: '',
        placeholder: 'Enter a string',
        description: 'The string to reverse',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const stringToReverse = this.getNodeParameter('stringToReverse', 0) as string;
    const reversedString = stringToReverse.split('').reverse().join('');

    returnData.push({ json: { reversedString } });

    return this.prepareOutputData(returnData);
  }
}

index.ts

Export your custom node.

import { INodeType } from 'n8n-workflow';
import { MyCustomNode } from './MyCustomNode.node';

export const nodeTypes: INodeType[] = [
  new MyCustomNode(),
];

4. Compile the TypeScript Code

Run the build script to compile your TypeScript code into JavaScript.

npm run build

This will generate a dist directory containing the compiled JavaScript files.
Docker Setup

To run n8n with your custom node, we’ll set up a Docker environment.
1. Create a Dockerfile

In the root of your project (n8n-custom-node), create a Dockerfile.

touch Dockerfile

Add the following content:

FROM n8nio/n8n:latest

USER root

# Copy the custom nodes folder
COPY ./custom_nodes /home/node/.n8n/custom/node_modules/custom_nodes

# Switch back to the node user
USER node

# Set the working directory
WORKDIR /home/node

# Use the default entrypoint and CMD from the base image

2. Create a Docker Compose File

Create a docker-compose.yml file in the root directory.

touch docker-compose.yml

Add the following content, using environment variables similar to those from your example setup:

volumes:
  n8n_storage:
  postgres_storage:

networks:
  n8n-local:

services:
  postgres:
    image: postgres:latest
    networks: ['n8n-local']
    restart: unless-stopped
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - postgres_storage:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    build:
      context: .
      dockerfile: Dockerfile
    image: n8nio/n8n:latest
    networks: ['n8n-local']
    container_name: n8n
    restart: unless-stopped
    ports:
      - 5678:5678
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_AI_OPENAI_API_KEY=${N8N_AI_OPENAI_API_KEY}
      - N8N_AI_OPENAI_MODEL=gpt-4o-2024-08-06
      - N8N_HOST=${N8N_HOST}
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - NODE_FUNCTION_ALLOW_EXTERNAL=*
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom/node_modules/custom_nodes
    links:
      - postgres
    volumes:
      - n8n_storage:/home/node/.n8n
      - ./custom_nodes:/home/node/.n8n/custom/node_modules/custom_nodes
    depends_on:
      postgres:
        condition: service_healthy


Running n8n with Your Custom Node

    Create a .env File: In the root of your project, create a .env file to store your environment variables.

POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
N8N_ENCRYPTION_KEY=your_encryption_key
N8N_AI_OPENAI_API_KEY=your_openai_api_key
N8N_HOST=your_n8n_host

Build the Docker Image

In your project root, run:

docker-compose build

This will build the Docker image, including your custom node.

Run the Docker Container

docker-compose up -d

This will start the n8n service in detached mode.

Verify the Container is Running

docker-compose ps

You should see the n8n service listed and running.

Check n8n Logs (optional):

    docker-compose logs -f n8n

    This can help you verify that n8n started correctly and that your custom node was loaded.

Using Your Custom Node in n8n

    Access n8n

    Open your web browser and navigate to http://localhost:5678.

    Create a New Workflow

    Click on “New Workflow” in the top-right corner.

    Add Your Custom Node
        Click on the “+” button to add a new node.
        Search for “My Custom Node”.
        Add it to your workflow.

    Configure the Node
        String to Reverse: Enter any string you wish to reverse.

    Execute the Workflow
        Click on “Execute Workflow” to run the workflow.
        After execution, click on the node to see the output.
        You should see the reversed string in the output.

Conclusion

Congratulations! You’ve successfully created a custom node for n8n, set up a Docker environment, and integrated your custom node into n8n using Docker Compose. This guide provides a foundation for you to develop more complex custom nodes tailored to your specific needs.
Additional Resources

    n8n Documentation: https://docs.n8n.io/
    n8n Community Forums: https://community.n8n.io/
    Docker Documentation: https://docs.docker.com/
    TypeScript Documentation: https://www.typescriptlang.org/docs/

Tips and Best Practices

    Node Development: When developing custom nodes, it’s helpful to refer to the n8n source code and existing nodes for examples.
    Testing: Regularly test your node during development to catch any issues early.
    Version Control: Use Git or another version control system to manage your code changes.
    Documentation: Comment your code and provide clear descriptions in your node’s description object to make it easier to use and maintain.
