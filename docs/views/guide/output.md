# 输出

[[toc]]

您可以将内容存储为 JSON 对象或良好的旧 HTML 字符串。两者都工作正常。当然，您可以将这两种格式都传递给编辑器以恢复您的内容。这是一个交互式示例，它在文档更改时将内容导出为 HTML 和 JSON：

## **出口**

### **选项 1：JSON**

JSON 可能更容易循环，例如寻找提及，它更像是 Tiptap 在幕后使用的东西。无论如何，如果您想使用 JSON 来存储内容，我们提供了一种方法来将内容检索为 JSON：

```jsx
const json = editor.getJSON()
```

您可以将其存储在您的数据库中（或将其发送到 API）并像这样最初恢复文档：

```jsx
new Editor({
  content: {
    "type": "doc",
    "content": [
      // …
    ]
  },
})
```

或者，如果您需要等待某事，您可以稍后通过编辑器实例进行：

```jsx
editor.commands.setContent({
  "type": "doc",
  "content": [
    // …
  ]
})
```

这是一个交互式示例，您可以在其中看到实际效果：

### **选项 2：HTML**

HTML 可以很容易地在其他地方呈现，例如在电子邮件中，它被广泛使用，所以在某些时候切换编辑器可能更容易。无论如何，每个编辑器实例都提供了一种从当前文档中获取 HTML 的方法：

```jsx
const html = editor.getHTML()
```

这可以用于最初恢复文档：

```jsx
new Editor({
  content: `<p>Example Text</p>`,
})
```

或者，如果您想稍后恢复内容（例如，在 API 调用完成后），您也可以这样做：

```jsx
editor.commands.setContent(`<p>Example Text</p>`)
```

### **选项 3：Y.js**

我们的编辑器对 Y.js 提供一流的支持，添加[实时协作、离线编辑或设备间同步](https://tiptap.dev/guide/collaborative-editing)等功能非常棒。

在内部，Y.js 存储了所有更改的历史记录。它可以在浏览器中、在服务器上、与其他连接的客户端同步或在 USB 记忆棒上。但是，重要的是要知道 Y.js 需要那些存储的更改。一个简单的 JSON 文档不足以合并更改。

当然，您可以导入现有的 JSON 文档以开始并从 Y.js 中获取 JSON，但这更像是一种导入/导出格式。它不会是您的单一来源。在为上述用例之一添加 Y.js 时，需要考虑这一点。

也就是说，这太棒了，我们即将提供一个令人惊叹的后端，这让一切变得轻而易举。

### **不是一个选项：Markdown**

不幸的是，**Tiptap 不支持 Markdown 作为输入或输出格式**。我们考虑过增加对它的支持，但这些是我们决定不这样做的原因：

- HTML 和 JSON 都可以有深层嵌套结构，Markdown 是扁平的。
- 降价标准各不相同。
- Tiptap 的强项是定制，这与 Markdown 配合得不是很好。
- 有足够的包将 HTML 转换为 Markdown，反之亦然。

您真的应该考虑使用 HTML 或 JSON 来存储您的内容，它们对于大多数用例来说都非常适合。

如果你仍然认为你需要 Markdown，ProseMirror 有一个[关于如何处理 Markdown 的例子](https://prosemirror.net/examples/markdown/)，[Nextcloud Text](https://github.com/nextcloud/text)使用 Tiptap 1 来处理 Markdown。也许你可以向他们学习。或者，如果您正在寻找一个非常好的 Markdown 编辑器，请尝试[CodeMirror](https://codemirror.net/)。

也就是说，Tiptap 确实支持[Markdown 快捷方式](https://tiptap.dev/examples/markdown-shortcuts)来格式化您的内容。您也可以自由地让您的内容看起来像 Markdown，例如在 CSS`#`之前添加一个`<h1>`。

## **监听变化**

如果你想在人们写作的同时持续存储更新的内容，你可以[挂钩事件](https://tiptap.dev/api/events)。这是一个示例：

```jsx
const editor = new Editor({
  // intial content
  content: `<p>Example Content</p>`,

  // triggered on every change
  onUpdate: ({ editor }) => {
    const json = editor.getJSON()
    // send the content to an API here
  },
})
```

## **渲染**

### **选项 1：Tiptap 的只读实例**

要呈现保存的内容，请将编辑器设置为只读。这就是您如何在不复制 CSS 和其他代码的情况下实现与编辑器中完全相同的渲染。

```jsx
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'

export default () => {
  const [editable, setEditable] = useState(false)
  const editor = useEditor({
    editable,
    content: `
        <p>
          This text is <strong>read-only</strong>. No matter what you try, you are not able to edit something. Okay, if you toggle the checkbox above you’ll be able to edit the text.
        </p>
        <p>
          If you want to check the state, you can call <code>editor.isEditable()</code>.
        </p>
      `,
    extensions: [StarterKit],
  })

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="checkbox">
        <input
          type="checkbox"
          id="editable"
          value={editable}
          onChange={event => setEditable(event.target.checked)}
        />
        <label htmlFor="editable">editable</label>
      </div>
      <EditorContent editor={editor} />
    </>
  )
}
```

### **选项 2：从 ProseMirror JSON 生成 HTML**

如果您需要在服务器端呈现内容，例如为用 Tiptap 编写的博客文章生成 HTML，您可能希望在没有实际编辑器实例的情况下这样做。

这就是它的`generateHTML()`用途。它是一个辅助函数，可以在没有实际编辑器实例的情况下呈现 HTML。

```jsx
import Bold from '@tiptap/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateHTML } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
// Option 1: Browser + server-side
import { generateHTML } from '@tiptap/html'
import React, { useMemo } from 'react'

const json = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Text',
        },
      ],
    },
  ],
}

export default () => {
  const output = useMemo(() => {
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Bold,
      // other extensions …
    ])
  }, [json])

  return (
    <pre>
      <code>{output}</code>
    </pre>
  )
}
```

顺便说一句，其他方式也是可能的。下面的示例展示了如何从 HTML 生成 JSON。

```jsx
import Bold from '@tiptap/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateJSON } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
// Option 1: Browser + server-side
import { generateJSON } from '@tiptap/html'
import React, { useMemo } from 'react'

const html = '<p>Example <strong>Text</strong></p>'

export default () => {
  const output = useMemo(() => {
    return generateJSON(html, [
      Document,
      Paragraph,
      Text,
      Bold,
      // other extensions …
    ])
  }, [html])

  return (
    <pre>
      <code>{JSON.stringify(output, null, 2)}</code>
    </pre>
  )
}
```

## **移民**

如果您要将现有内容迁移到 Tiptap，我们建议您将现有输出转换为 HTML。这可能是将您的初始内容放入 Tiptap 的最佳格式，因为 ProseMirror 确保它没有任何问题。即使有一些不允许的标签或属性（根据您的配置），Tiptap 也会悄悄地把它们扔掉。

我们将通过一些案例来帮助解决这个问题，例如，我们提供了一个 PHP 包来将 HTML 转换为兼容的 JSON 结构：[ueberdosis/prosemirror-to-html](https://github.com/ueberdosis/html-to-prosemirror)。

[与我们分享您的经验！](mailto:humans@tiptap.dev)我们想在这里添加更多信息。

## **安全**

出于安全考虑，没有理由使用其中之一。如果有人想向您的服务器发送恶意内容，无论是 JSON 还是 HTML 都没有关系。您是否使用 Tiptap 甚至都没有关系。您应该始终验证用户输入。