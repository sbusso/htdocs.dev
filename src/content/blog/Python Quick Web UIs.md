---
created: 2024-03-16T11:12
updated: 2024-03-16T11:20
title: Python Quick Web UIs
description: Quickly build web ui with python frameworks
published: true
---

A list of libraries to build quick Web UI with python
## Gradio
Gradio is the fastest way to demo your machine learning model with a friendly web interface so that anyone can use it, anywhere!

https://www.gradio.app

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