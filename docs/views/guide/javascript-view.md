# JavaScript的节点视图

如果您习惯在没有这两个框架的情况下工作，那么使用 Vue 或 React 等框架可能会感觉太复杂。好消息：您可以在节点视图中使用 Vanilla JavaScript。您只需要了解一点点，但让我们逐一讨论。

## 使用 JavaScript 渲染节点视图
以下是在编辑器中渲染节点视图所需执行的操作：

- 创建节点扩展
- 注册一个新的节点视图addNodeView()
- 编写你的渲染函数
- 配置 Tiptap 以使用新的节点扩展

您的节点扩展如下所示：

```js
import { Node } from '@tiptap/core'

export default Node.create({
  // configuration …

  addNodeView() {
    return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {
      const dom = document.createElement('div')

      dom.innerHTML = 'Hello, I’m a node view!'

      return {
        dom,
      }
    }
  },
})
```
知道了？让我们看看它的实际效果。请随意复制下面的示例来开始。

index.vue
```vue
<template>
  <editor-content :editor="editor" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import NodeView from './Extension.js'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        NodeView,
      ],
      content: `
        <p>
          This is still the text editor you’re used to, but enriched with node views.
        </p>
        <node-view></node-view>
        <p>
          Did you see that? That’s a JavaScript node view. We are really living in the future.
        </p>
      `,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.node-view {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

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
</style>
```

Extension.js
```js
import { mergeAttributes, Node } from '@tiptap/core'

export default Node.create({
  name: 'nodeView',

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
        tag: 'node-view',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['node-view', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      const { view } = editor

      // Markup
      /*
        <div class="node-view">
          <span class="label">Node view</span>

          <div class="content">
            <button>
              This button has been clicked ${node.attrs.count} times.
            </button>
          </div>
        </div>
      */

      const dom = document.createElement('div')

      dom.classList.add('node-view')

      const label = document.createElement('span')

      label.classList.add('label')
      label.innerHTML = 'Node view'

      const content = document.createElement('div')

      content.classList.add('content')

      const button = document.createElement('button')

      button.innerHTML = `This button has been clicked ${node.attrs.count} times.`
      button.addEventListener('click', () => {
        if (typeof getPos === 'function') {
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
            count: node.attrs.count + 1,
          }))

          editor.commands.focus()
        }
      })
      content.append(button)

      dom.append(label, content)

      return {
        dom,
      }
    }
  },
})
```

该节点视图甚至可以与编辑器交互。是时候看看它是如何连接的了。

## 访问节点属性
编辑器将一些有用的东西传递给您的渲染函数。其中之一就是node道具。这使您能够在节点视图中访问节点属性。假设您已向节点扩展添加了一个名为的属性。count您可以像这样访问该属性：

```js
addNodeView() {
  return ({ node }) => {
    console.log(node.attrs.count)

    // …
  }
}
```

## 更新节点属性
您甚至可以借助getPos传递给渲染函数的 prop 来从节点视图更新节点属性。使用更新属性的对象调度新事务：

```js
addNodeView() {
  return ({ editor, node, getPos }) => {
    const { view } = editor

    // Create a button …
    const button = document.createElement('button')
    button.innerHTML = `This button has been clicked ${node.attrs.count} times.`

    // … and when it’s clicked …
    button.addEventListener('click', () => {
      if (typeof getPos === 'function') {
        // … dispatch a transaction, for the current position in the document …
        view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
          count: node.attrs.count + 1,
        }))

        // … and set the focus back to the editor.
        editor.commands.focus()
      }
    })

    // …
  }
}
```

是不是看起来有点太复杂了？如果您的项目中有其中之一，请考虑使用React或Vue 。有了这两个人，事情就变得容易一些。

## 添加可编辑内容
要将可编辑内容添加到节点视图，您需要传递一个contentDOM内容的容器元素。这是节点视图的简化版本，其中包含不可编辑和可编辑的文本内容：

```js
// Create a container for the node view
const dom = document.createElement('div')

// Give other elements containing text `contentEditable = false`
const label = document.createElement('span')
label.innerHTML = 'Node view'
label.contentEditable = false

// Create a container for the content
const content = document.createElement('div')

// Append all elements to the node view container
dom.append(label, content)

return {
  // Pass the node view container …
  dom,
  // … and the content container:
  contentDOM: content,
}
```

知道了？只要您返回一个用于节点视图的容器和另一个用于内容的容器，您就可以自由地执行任何您喜欢的操作。这是上面的例子：

index.vue
```vue
<template>
  <editor-content :editor="editor" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

import NodeView from './Extension.js'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        NodeView,
      ],
      content: `
        <p>
          This is still the text editor you’re used to, but enriched with node views.
        </p>
        <node-view>
          <p>This is editable.</p>
        </node-view>
        <p>
          Did you see that? That’s a JavaScript node view. We are really living in the future.
        </p>
      `,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.node-view {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

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
</style>
```

Extension.js
```js
import { mergeAttributes, Node } from '@tiptap/core'

export default Node.create({
  name: 'nodeView',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'node-view',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['node-view', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return () => {
      // Markup
      /*
        <div class="node-view">
          <span class="label">Node view</span>

          <div class="content"></div>
        </div>
      */

      const dom = document.createElement('div')

      dom.classList.add('node-view')

      const label = document.createElement('span')

      label.classList.add('label')
      label.innerHTML = 'Node view'
      label.contentEditable = false

      const content = document.createElement('div')

      content.classList.add('content')

      dom.append(label, content)

      return {
        dom,
        contentDOM: content,
      }
    }
  },
})
```

请记住，此内容是由 Tiptap 呈现的。这意味着您需要告诉允许什么类型的内容，例如在`content: 'inline*'`您的节点扩展中（这就是我们在上面的示例中使用的内容）。