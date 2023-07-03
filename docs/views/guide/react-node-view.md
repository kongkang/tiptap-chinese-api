# React的节点视图

如果您习惯在 React 中工作，那么使用 Vanilla JavaScript 可能会感觉很复杂。好消息：您也可以在节点视图中使用常规 React 组件。您只需要了解一点点，但让我们逐一讨论。

## 渲染 React 组件
以下是在编辑器中渲染 React 组件所需执行的操作：

1. 创建节点扩展
2. 创建一个 React 组件
3. 将该组件传递给提供的ReactNodeViewRenderer
4. 注册它addNodeView()
5. 配置 Tiptap 以使用新的节点扩展

您的节点扩展如下所示：

```jsx
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './Component.jsx'

export default Node.create({
  // configuration …

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
```

要完成这项工作需要一点魔法。但不用担心，我们提供了一个包装器组件，您可以使用它轻松入门。不要忘记将其添加到您的自定义 React 组件中，如下所示：

```jsx
<NodeViewWrapper className="react-component">
  React Component
</NodeViewWrapper>
```
知道了？让我们看看它的实际效果。请随意复制下面的示例来开始。

index.jsx
```jsx
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import ReactComponent from './Extension.js'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ReactComponent,
    ],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>
    <react-component count="0"></react-component>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `,
  })

  return (
    <EditorContent editor={editor} />
  )
}
```
Component.jsx
```jsx
export default props => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="react-component">
      <span className="label">React Component</span>

      <div className="content">
        <button onClick={increase}>
          This button has been clicked {props.node.attrs.count} times.
        </button>
      </div>
    </NodeViewWrapper>
  )
}
```
Extension.js
```js
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './Component.jsx'

export default Node.create({
  name: 'reactComponent',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
```
styles.scss
```scss
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.react-component {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;

  .label {
    margin-left: 1rem;
    background-color: #0D0D0D;
    font-size: 0.6rem;
    letter-spacing: 1px;
    font-weight: bold;
    text-transform: uppercase;
    color: #fff;
    position: absolute;
    top: 0;
    padding: 0.25rem 0.75rem;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .content {
    margin-top: 1.5rem;
    padding: 1rem;
  }
}
```

不过，该组件不与编辑器交互。是时候把它连起来了。

## 访问节点属性
您ReactNodeViewRenderer在节点扩展中使用的 ，将一些非常有用的 props 传递给您的自定义 React 组件。其中之一就是node道具。假设您已经添加了一个名为count节点扩展的属性（就像我们在上面的示例中所做的那样），您可以像这样访问它：

```jsx
props.node.attrs.count
```

## 更新节点属性
您甚至可以借助`updateAttributes`传递给组件的 prop 来更新节点的节点属性。将具有更新属性的对象传递给`updateAttributes`prop：

```jsx
export default props => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  // …
}
```

是的，所有这些也是反应性的。这是一种非常无缝的沟通，不是吗？

## 添加可编辑内容

还有另一个组件可以NodeViewContent帮助您将可编辑内容添加到节点视图中。这是一个例子：

```jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default () => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <span className="label" contentEditable={false}>React Component</span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}
```

您不需要添加这些className属性，可以随意删除它们或传递其他类名。请尝试以下示例：

index.jsx
```jsx
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import ReactComponent from './Extension.js'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ReactComponent,
    ],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>
    <react-component>
      <p>This is editable. You can create a new component by pressing Mod+Enter.</p>
    </react-component>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `,
  })

  return (
    <EditorContent editor={editor} />
  )
}
```
Component.jsx
```jsx
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default () => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <span className="label" contentEditable={false}>React Component</span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}
```
Extension.js
```js
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './Component.jsx'

export default Node.create({
  name: 'reactComponent',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
```
styles.scss
```scss
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.react-component-with-content {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;

  .label {
    margin-left: 1rem;
    background-color: #0D0D0D;
    font-size: 0.6rem;
    letter-spacing: 1px;
    font-weight: bold;
    text-transform: uppercase;
    color: #fff;
    position: absolute;
    top: 0;
    padding: 0.25rem 0.75rem;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .content {
    margin: 2.5rem 1rem 1rem;
    padding: 0.5rem;
    border: 2px dashed #0D0D0D20;
    border-radius: 0.5rem;
  }
}
```

请记住，此内容是由 Tiptap 呈现的。这意味着您需要告诉允许什么类型的内容，例如在`content: 'inline*'`您的节点扩展中（这就是我们在上面的示例中使用的内容）。

和组件呈现`NodeViewWrapperHTML`标记（用于内联节点），但您可以更改它。例如应该呈现一个段落。但有一个限制：该标签在运行时不得更改。`NodeViewContent<div><span><NodeViewContent as="p">`

## 参数
以下是您可以期待的参数完整列表：

### editor
编辑器实例

### node
当前节点

### decorations
一系列的装饰品

### selected
trueNodeSelection当当前节点视图有一个

### extension
访问节点扩展，例如获取选项

### getPos()
获取当前节点的文档位置

### updateAttributes()
更新当前节点的属性

### deleteNode()
删除当前节点

## 拖拽
要使节点视图可拖动，请`draggable: true`在扩展中设置并添加data-drag-handle到应充当拖动手柄的 DOM 元素。