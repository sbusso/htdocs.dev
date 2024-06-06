---
created: 2024-03-16T23:35
updated: 2024-03-16T23:45
title: Agent Definition Framework
description: A high level agent framework
published: true
tags:
  - ai
---
## Agent

- **Model**
    - **Style**: The agent’s interactive style, aligned with the company’s voice, determining its communicative approach.
    - **Trained**: The agent’s specialization level, indicating its proficiency in specific tasks within its knowledge domain.
    - **Parameters:** A set of specific parameters that guide the agent's responses and interactions.
- **Instructions**: Adaptive guidelines that direct the agent’s actions, ensuring alignment with user or organizational objectives.
- **Knowledge**: A dynamic knowledge base comprising external data and user-provided content, with continuous updates and expansion mechanisms.
- **Tools**: A set of tools the agent can handle.
- **Capabilities**: A description of the agent’s autonomous functions, dictated by its knowledge, training, and available tools, with examples of tasks or scenarios it can handle.

3 special agents:
- **Programmatic Agent**: A programmatic agent is enhanced with programmatic rules to push the model to improve its results. Programmatic agents can enhance tasks using self-reflection.md, React.md, CoT, ToT, etc.
- **Orchestrator**: A higher-order agent whose primary role is task planning and routing.
	- **Role**: Analyzes the requirements of a given job, plans and delegates tasks to appropriate agents. It ensures that each task is assigned to the agent best suited to handle it, optimizing for efficiency and quality of results.
	- **Routing**
	- **Completion & Compilation:** As tasks are completed, results are either sent back to the user or compiled together if the job requires a consolidated output.
- **Builder**: An agent trained to assist the user in constructing agents.
- **Auditing**: Reviewing the workflow and execution of agents' feedback in the learning loop. Monitoring and eval of execution.
## Execution
- **Job**: A specific responsibility or assignment that contributes to the completion of a project. It handles agents, orchestration, and memory.
	- **State**: **Shared Memory** + **Status** (current plan)
	- **Workflow**/**Chain**: A structured process or sequence of tasks executed to accomplish a specific outcome within a job. It defines how tasks are organized and interact to complete a particular job.
		- **Task**: The smallest unit of work within a workflow. It is a specific action or activity needed to progress or complete a portion of a workflow.
		- **User Interaction**: The user provides feedback, additional information, or clarifications regarding the task or its artifacts. This input can be proactive, such as offering specifications at the outset, or reactive, in response to queries or updates from the agents during the work process.
- **Blueprint** / **Plan** | Class / Instance: the overarching structure or design of a job or workflow (Blueprint/Class), and its specific implementation in a given context (Plan/Instance).
## Memory
- **Active memory** (RAM)
- **Log / Archive memory** (Append Only / Reorganise) shared/exposed/security/Enriched
- **Preferences**
## Scenario
- **User Request**: A user introduces a job request into the system. This could be a complex project requiring multi-faceted expertise, like launching a new product.
- TBC...


---
## Other

- **Conversation**/**Chat**: An interactive system facilitating an exchange with one or more agents towards a specific purpose, equipped with its intrinsic memory for context retention and continuity.
