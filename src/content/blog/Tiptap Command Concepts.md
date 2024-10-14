---
title: "Tiptap Command Concepts: commands, chain, can, tr, state, view, dispatch"
author: Stephane Busso
description: Commands to interact with Tiptap editor
published: true
tags:
  - tiptap
  - wysiwyg
updated: 2024-10-15T12:21
created: 2024-10-15T12:20
cover: 
---
## 1. commands

The `commands` object provides access to all available commands in the editor. These are predefined and custom commands that modify the editor's content or state.

Usage:
```typescript
addCommands() {
  return {
    myCustomCommand: () => ({ commands }) => {
      // Use built-in commands
      commands.setTextSelection({ from: 0, to: 5 })
      commands.insertContent('Hello, world!')
      return true
    }
  }
}
```

## 2. chain

The `chain` function allows you to run multiple commands in sequence. It's useful when you need to perform several operations as a single atomic action.

Usage:
```typescript
addCommands() {
  return {
    myChainedCommand: () => ({ chain }) => {
      return chain()
        .setTextSelection({ from: 0, to: 5 })
        .insertContent('Hello, world!')
        .run()
    }
  }
}
```

## 3. can

The `can` function checks if a command can be executed in the current editor state without actually running it. It's useful for enabling/disabling UI elements based on the current context.

Usage:
```typescript
addCommands() {
  return {
    myConditionalCommand: () => ({ can, commands }) => {
      if (can().setTextSelection({ from: 0, to: 5 })) {
        return commands.insertContent('Hello, world!')
      }
      return false
    }
  }
}
```

## 4. tr (Transaction)

The `tr` object represents a transaction - a set of steps that, when applied, will transform the document. It's a lower-level API that gives you fine-grained control over document changes.

Usage:
```typescript
addCommands() {
  return {
    myTransactionCommand: () => ({ tr, dispatch }) => {
      // Modify the transaction
      tr.insertText('Hello, world!', 0)
      
      // Apply the transaction
      if (dispatch) dispatch(tr)
      return true
    }
  }
}
```

## 5. state

The `state` object represents the current state of the editor, including the document, selection, and other metadata.

Usage:
```typescript
addCommands() {
  return {
    myStateAwareCommand: () => ({ state, commands }) => {
      const { from, to } = state.selection
      if (to - from > 0) {
        return commands.insertContent('Replaced selection')
      }
      return false
    }
  }
}
```

## 6. view

The `view` object provides access to the ProseMirror EditorView, which handles the rendering of the editor and user interactions.

Usage:
```typescript
addCommands() {
  return {
    myViewCommand: () => ({ view, dispatch }) => {
      // Access DOM node
      const domNode = view.dom
      // Dispatch a transaction
      view.dispatch(view.state.tr.insertText('Hello from view!'))
      return true
    }
  }
}
```

## 7. dispatch

The `dispatch` function is used to apply a transaction to the editor state. If `dispatch` is null, it means the command should only compute whether it can be applied, without actually modifying the state.

Usage:
```typescript
addCommands() {
  return {
    myDispatchCommand: () => ({ tr, dispatch }) => {
      // Modify the transaction
      tr.insertText('Hello, world!', 0)
      
      // Apply the transaction if dispatch is available
      if (dispatch) {
        dispatch(tr)
        return true
      }
      
      // If dispatch is null, just return whether the command can be applied
      return tr.docChanged
    }
  }
}
```

Remember, when defining commands in Tiptap extensions, you typically return a function that receives an object with these properties. This allows your commands to interact with the editor in powerful and flexible ways.