---
title: Streamsync
author: Stephane Busso
description: Streamsync is a new open-source framework for building data apps that combines a no-code frontend using a visual editor with a Python backend
published: true
tags:
  - python
  - ui
  - streamsync
updated: 2024-03-17T15:12
created: 2024-03-17T15:11:15+13:00
cover: 
url: https://github.com/streamsync-cloud/streamsync
---
Streamsync is a new open-source framework for building data apps that combines a no-code frontend using a visual editor with a Python backend. It aims to provide faster response times compared to competitors like Streamlit by running the user script only once, using WebSockets for syncing frontend and backend states, and keeping things in memory without the need for caching.



<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://repository-images.githubusercontent.com/460609164/7594fadd-7b21-4132-b9aa-a67603d32c8e" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <img src="https://github.githubassets.com/favicons/favicon.svg" alt="Favicon" class="w-4 h-4 mr-2">
      <a href="https://github.com/streamsync-cloud/streamsync" target="_blank" class="text-blue-600 hover:underline">"GitHub - streamsync-cloud/streamsync: No-code in the front, Python in the back. An open-source framework for creating data apps."</a>
    </div>
    <p class="text-gray-600">"No-code in the front, Python in the back. An open-source framework for creating data apps. - streamsync-cloud/streamsync"</p>
  </div>
</div>



Key features of Streamsync include:

1. A visual user interface editor called Streamsync Builder that allows users to focus on the application logic while easily creating complex layouts.
2. State-driven, reactive user interfaces that separate the UI from the logic, using a consistent yet customizable design system.
3. Event handlers as plain Python functions for a predictable flow of execution.
4. Built using Python, TypeScript, Vue, and FastAPI, and distributed as a standard Python package.

Streamsync's architecture involves sending events from the browser to the web server via WebSockets, passing them to the AppRunner, and dispatching them to the isolated AppProcess for handling. The user interface is detached from the logic, allowing for easy component replacement and state synchronization.

The project is still in its early stages, with plans to focus on sharing Streamsync, gathering feedback, and adding features like a high-performance data grid, refined input components, and improved observability. Streamsync can be installed via pip and requires Python 3.9.2 or higher.