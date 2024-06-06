---
created: 2024-03-16T11:12
updated: 2024-03-26T01:21
title: Python Quick Web UIs
description: Quickly build web ui with python frameworks
published: true
tags: []
author: Stephane Busso
cover:
---

A list of libraries to build quick Web UI with python
## Gradio
Gradio is the fastest way to demo your machine learning model with a friendly web interface so that anyone can use it, anywhere.

![Pasted image 20240316213331.png](/assets/Pasted%20image%2020240316213331.png)

Machine Learning Oriented, Hugging Face integration

https://www.gradio.app

Fastapi


```python
import gradio as gr

def greet(name):
    return "Hello " + name + "!"

demo = gr.Interface(fn=greet, inputs="text", outputs="text")
demo.launch()
```

Gradio Playground
https://www.gradio.app/playground

Hosting Hugging Face Spaces or self hosted

## Hyperdiv
Open-source framework for rapidly building reactive web UIs in Python, with built-in [Shoelace](https://shoelace.style/) components, Markdown, charts, tables, and more.

```sh
pip install hyperdiv
hyperdiv docs
```

https://hyperdiv.io

deploy to
https://replit.com
https://railway.app
https://fly.io


## Streamlit
Streamlit is an open-source Python library that provides development components to create and share beautiful and easy to use custom web applications for machine learning and data science. Streamlit is a data app framework that can also be used as a data dashboarding tool. Using just a few lines of code, one can build and deploy powerful data apps in a matter of a few minutes.

![Pasted image 20240316154825.png](/assets/Pasted%20image%2020240316154825.png)
## Plotly Dash
![Pasted image 20240316154911.png](/assets/Pasted%20image%2020240316154911.png)
### Dash

<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">

  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://dash.plotly.com" target="_blank" class="text-blue-600 hover:underline">Dash Documentation & User Guide | Plotly</a>
    </div>
    <p class="text-gray-600">Plotly Dash User Guide & Documentation</p>
  </div>
</div>


### Evidence


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://opengraph.githubassets.com/dca37f576300b8c88e265f0b2d7db98a49663415f91315a3d3a0234f0669e20e/evidence-dev/evidence" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/evidence-dev/evidence" target="_blank" class="text-blue-600 hover:underline">evidence-dev/evidence: Business intelligence as code: build fast, interactive data visualizations in pure SQL and markdown</a>
    </div>
    <p class="text-gray-600">Business intelligence as code: build fast, interactive data visualizations in pure SQL and markdown - evidence-dev/evidence</p>
  </div>
</div>


## Perspective


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">

  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://perspective.finos.org" target="_blank" class="text-blue-600 hover:underline">Perspective | Perspective</a>
    </div>

  </div>
</div>


![Pasted image 20240317223642.png](/assets/Pasted%20image%2020240317223642.png)

## PySimpleGUI
**PySimpleGUI** creates graphical user interfaces (GUIs) using Python, quickly and easily!

https://www.pysimplegui.com

1. Make sure Python is installed.
2. Install PySimpleGUI:
    python3 -m pip install pysimplegui

3. Download [main.py](https://901301.pysimplegui.work/main.py), which contains:
```python
import PySimpleGUI as sg

# All the stuff inside your window.
layout = [  [sg.Text("What's your name?")],
			[sg.InputText()],
			[sg.Button('Ok'), sg.Button('Cancel')] ]

# Create the Window
window = sg.Window('Hello Example', layout)

# Event Loop to process "events" and get the "values" of the inputs
while True:
	event, values = window.read()

	# if user closes window or clicks cancel
	if event == sg.WIN_CLOSED or event == 'Cancel':
		break

print('Hello', values[0], '!')
window.close()
```

4. Run:
```python
pyhon3 main.py
```

## Reflex



<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://repository-images.githubusercontent.com/557075997/706f3d88-a086-4b3a-9239-845d5d410aad" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/reflex-dev/reflex" target="_blank" class="text-blue-600 hover:underline">reflex-dev/reflex: 🕸️ Web apps in pure Python 🐍</a>
    </div>
    <p class="text-gray-600">🕸️ Web apps in pure Python 🐍. Contribute to reflex-dev/reflex development by creating an account on GitHub.</p>
  </div>
</div>


## Other frameworks:



<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://repository-images.githubusercontent.com/460609164/7594fadd-7b21-4132-b9aa-a67603d32c8e" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/streamsync-cloud/streamsync" target="_blank" class="text-blue-600 hover:underline">streamsync-cloud/streamsync: No-code in the front, Python in the back. An open-source framework for creating data apps.</a>
    </div>
    <p class="text-gray-600">No-code in the front, Python in the back. An open-source framework for creating data apps. - streamsync-cloud/streamsync</p>
  </div>
</div>

Streamsync is an open-source framework for creating data apps. Build user interfaces using a visual editor; write the backend code in Python.


## GUI

### Kivy


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://opengraph.githubassets.com/7c8ab3cd8a832a9e24000e90400f3c49be1db495604ba9c30f97c4537656ac78/kivy/kivy" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/kivy/kivy" target="_blank" class="text-blue-600 hover:underline">kivy/kivy: Open source UI framework written in Python, running on Windows, Linux, macOS, Android and iOS</a>
    </div>
    <p class="text-gray-600">Open source UI framework written in Python, running on Windows, Linux, macOS, Android and iOS - kivy/kivy</p>
  </div>
</div>


Open source UI framework written in Python, running on Windows, Linux, macOS, Android and iOS

## Data Oriented / Dashboards

### Panel


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">

  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://panel.holoviz.org" target="_blank" class="text-blue-600 hover:underline">Overview — Panel v1.3.9a1</a>
    </div>

  </div>
</div>


![Pasted image 20240317211633.png](/assets/Pasted%20image%2020240317211633.png)

## Voila / Voici


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">

  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://voici.readthedocs.io/en/latest/" target="_blank" class="text-blue-600 hover:underline">Try it online — voici 0.6.0 documentation</a>
    </div>

  </div>
</div>


### Bokeh



<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="http://static.bokeh.org/og/logotype-on-hex.png" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://docs.bokeh.org/en/latest/index.html" target="_blank" class="text-blue-600 hover:underline">Bokeh documentation</a>
    </div>
    <p class="text-gray-600">Bokeh is a Python library for creating interactive visualizations for modern web browsers. It helps you build beautiful graphics, ranging from simple plots to complex dashboards with streaming data...</p>
  </div>
</div>



### Binder


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://mybinder.org/static/images/logo_social.png" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://mybinder.org" target="_blank" class="text-blue-600 hover:underline">The Binder Project</a>
    </div>
    <p class="text-gray-600">Reproducible, sharable, open, interactive computing environments.</p>
  </div>
</div>


## Deployment


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://ploomber.io" target="_blank" class="text-blue-600 hover:underline">Ploomber</a>
    </div>
    <p class="text-gray-600">Ploomber: Ship AI applications</p>
  </div>
</div>




<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://streamlit.io/sharing-image-facebook.jpg" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://streamlit.io" target="_blank" class="text-blue-600 hover:underline">Streamlit • A faster way to build and share data apps</a>
    </div>
    <p class="text-gray-600">Streamlit is an open-source Python framework for machine learning and data science teams. Create interactive data apps in minutes.</p>
  </div>
</div>



### Observable


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">

  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://observablehq.com/framework/" target="_blank" class="text-blue-600 hover:underline">Observable Framework</a>
    </div>

  </div>
</div>


### Quatro


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://quarto.org/quarto-dark-bg.jpeg" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://quarto.org" target="_blank" class="text-blue-600 hover:underline">Quarto</a>
    </div>
    <p class="text-gray-600">An open source technical publishing system for creating beautiful articles, websites, blogs, books, slides, and more. Supports Python, R, Julia, and JavaScript.</p>
  </div>
</div>


### PyGWalker


<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://repository-images.githubusercontent.com/602389947/f12f5f75-9f5e-4306-a443-f19104de881e" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/Kanaries/pygwalker" target="_blank" class="text-blue-600 hover:underline">Kanaries/pygwalker: PyGWalker: Turn your pandas dataframe into an interactive UI for visual analysis</a>
    </div>
    <p class="text-gray-600">PyGWalker: Turn your pandas dataframe into an interactive UI for visual analysis - Kanaries/pygwalker</p>
  </div>
</div>
