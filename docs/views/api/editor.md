# 编辑

[[toc]]

这个类是 Tiptap 的核心构建块。[它完成了创建工作ProseMirror](https://prosemirror.net/)编辑器的大部分繁重工作 ，例如创建[EditorView](https://prosemirror.net/docs/ref/#view.EditorView)、设置初始值[EditorState](https://prosemirror.net/docs/ref/#state.Editor_State)等。

## 方法

编辑器实例将提供一堆公共方法。方法是常规函数，可以返回任何内容。他们会帮助您与编辑器一起工作。

不要混淆方法和[命令](https://tiptap.dev/api/commands)。命令用于更改编辑器的状态（内容、选择等）并且只返回`true`或`false`。

### can()

检查命令或命令链是否可以执行——无需实际执行。对启用/禁用或显示/隐藏按钮非常有帮助。

```jsx
// Returns `true` if the undo command can be executed
editor.can().undo()
```

### chain()

创建命令链以一次调用多个命令。

```jsx
// Execute two commands at once
editor.chain().toggleBold().focus().run()
```

### destroy()

停止编辑器实例并取消绑定所有事件。

```jsx
// Hasta la vista, baby!
editor.destroy()
```

### getHTML()

以 HTML 形式返回当前编辑器文档

```jsx
editor.getHTML()
```

### getJSON()

将当前编辑器文档作为 JSON 返回。

```jsx
editor.getJSON()
```

### getText()

Returns the current editor document as plain text.

| Parameter | Type | Description |
| --- | --- | --- |
| options | { blockSeparator?: string, textSerializers?: Record`<string, TextSerializer>`} | Options for the serialization. |

```jsx
// Give me plain text!
editor.getText()
// Add two line breaks between nodes
editor.getText({ blockSeparator: "\n\n" })
```

### getAttributes()

获取当前选中的节点或标记的属性。

| Parameter | Type | Description |
| --- | --- | --- |
| typeOrName | string | NodeType | MarkType | Name of the node or mark |

```jsx
editor.getAttributes('link').href
```

### isActive()

如果当前选定的节点或标记处于活动状态，则返回。

| Parameter | Type | Description |
| --- | --- | --- |
| name | string | null | Name of the node or mark |
| attributes | Record`<string, any>` | Attributes of the node or mark |

```jsx
// Check if it’s a heading
editor.isActive('heading')
// Check if it’s a heading with a specific attribute value
editor.isActive('heading', { level: 2 })
// Check if it has a specific attribute value, doesn’t care what node/mark it is
editor.isActive({ textAlign: 'justify' })
```

### registerPlugin()

注册一个 ProseMirror 插件。

| Parameter | Type | Description |
| --- | --- | --- |
| plugin | Plugin | A ProseMirror plugin |
| handlePlugins? | (newPlugin: Plugin, plugins: Plugin[]) => Plugin[] | Control how to merge the plugin into the existing plugins |

### setOptions()

更新编辑器选项。

| Parameter | Type | Description |
| --- | --- | --- |
| options | Partial`<EditorOptions>` | A list of options |

```jsx
// Add a class to an existing editor instance
editor.setOptions({
  editorProps: {
    attributes: {
      class: 'my-custom-class',
    },
  },
})
```

### setEditable()

更新编辑器的可编辑状态。

| Parameter | Type | Description |
| --- | --- | --- |
| editable | boolean | true when the user should be able to write into the editor. |

```jsx
// Make the editor read-only
editor.setEditable(false)
```

### unregisterPlugin()

注销 ProseMirror 插件。

| Parameter | Type | Description |
| --- | --- | --- |
| nameOrPluginKey | string | PluginKey | The plugins name |

## 接收器

### isEditable

返回编辑器是可编辑的还是只读的。

```
editor.isEditable
```

### isEmpty

检查是否有内容。

```
editor.isEmpty
```

## 设置

### element

`element`指定编辑器将绑定到的 HTML 元素。以下代码将 Tiptap 与一个元素与`.element`类集成：

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    StarterKit,
  ],
})
```

您甚至可以在将编辑器安装到元素之前启动您的编辑器。这在您的 DOM 尚不可用时很有用。只需省略`element`，我们将为您创建一个。以后像这样将它附加到您的容器中：

```jsx
yourContainerElement.append(editor.options.element)
```

### extensions

需要将扩展列表传递给`extensions`属性，即使您只想允许段落。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Highlight from '@tiptap/extension-highlight'

new Editor({
  // Use the default extensions
  extensions: [
    StarterKit,
  ],

  // … or use specific extensions
  extensions: [
    Document,
    Paragraph,
    Text,
  ],

  // … or both
  extensions: [
    StarterKit,
    Highlight,
  ],
})
```

### content

使用该`content`属性，您可以为编辑器提供初始内容。这可以是 HTML 或 JSON。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
  ],
})
```

### editable

该`editable`属性确定用户是否可以写入编辑器。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
  ],
  editable: false,
})
```

### autofocus

您可以在`autofocus`初始化时强制光标在编辑器中跳转。

| Value | Description |
| --- | --- |
| 'start' | 将焦点设置到文档的开头。 |
| 'end' | 将焦点设置到文档的末尾。 |
| 'all' | 选择整个文档。 |
| Number | 将焦点设置到文档中的特定位置。 |
| true | 启用自动对焦。 |
| false | 禁用自动对焦。 |
| null | 禁用自动对焦。 |

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit,
  ],
  autofocus: false,
})
```

### enableInputRules

默认情况下，Tiptap 启用所有[输入规则](https://tiptap.dev/guide/custom-extensions/#input-rules)。`enableInputRules`你可以控制它。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
  ],
  enableInputRules: false,
})
```

或者，您可以只允许特定的输入规则。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
    Link,
  ],
  // pass an array of extensions or extension names
  // to allow only specific input rules
  enableInputRules: [Link, 'horizontalRule'],
})
```

### enablePasteRules

默认情况下，Tiptap 启用所有[粘贴规则](https://tiptap.dev/guide/custom-extensions/#paste-rules)。`enablePasteRules`你可以控制它。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
  ],
  enablePasteRules: false,
})
```

或者，您可以只允许特定的粘贴规则。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [
    StarterKit,
    Link,
  ],
  // pass an array of extensions or extension names
  // to allow only specific paste rules
  enablePasteRules: [Link, 'horizontalRule'],
})
```

### injectCSS

默认情况下，Tiptap 会注入[一点 CSS](https://github.com/ueberdosis/tiptap/tree/main/packages/core/src/style.ts)。`injectCSS`你可以禁用它。

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit,
  ],
  injectCSS: false,
})
```

### injectNonce

当您将[Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)与 一起使用时`nonce`，您可以指定`nonce`要添加到动态创建的元素。这是一个例子：

```jsx
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit,
  ],
  injectCSS: true,
  injectNonce: "your-nonce-here"
})
```

### editorProps

对于高级用例，您可以传递`editorProps`将由[ProseMirror](https://prosemirror.net/docs/ref/#view.EditorProps)处理的。您可以使用它来覆盖各种编辑器事件或更改编辑器 DOM 元素属性，例如添加一些 Tailwind 类。这是一个例子：

```jsx
new Editor({
  // Learn more: https://prosemirror.net/docs/ref/#view.EditorProps
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
    transformPastedText(text) {
      return text.toUpperCase()
    }
  }
})
```

您可以使用它来挂接到事件处理程序并传递 - 例如 - 自定义粘贴处理程序。**

### parseOptions

传递的内容由 ProseMirror 解析。要挂钩解析，您可以传递`parseOptions`然后由[ProseMirror](https://prosemirror.net/docs/ref/#model.ParseOptions)处理。

```jsx
new Editor({
  // Learn more: https://prosemirror.net/docs/ref/#model.ParseOptions
  parseOptions: {
    preserveWhitespace: 'full',
  },
})
```