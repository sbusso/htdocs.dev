---
created: 2024-03-16T11:12
updated: 2024-03-16T16:26
title: Python Quick Web UIs
description: Quickly build web ui with python frameworks
published: true
---

A list of libraries to build quick Web UI with python

## Gradio

Gradio is the fastest way to demo your machine learning model with a friendly web interface so that anyone can use it, anywhere.

Machine Learning Oriented, Hugging Face integration
![Pasted image 20240316113520.png](/assets/Pasted%20image%2020240316113520.png)
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
