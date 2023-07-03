# 配置

[[toc]]

在大多数情况下，只需说明 Tiptap 应在何处呈现 ( `element`)、您要启用哪些功能 ( `extensions`) 以及初始文档应该是什么 ( `content`)。

不过，还可以配置更多的东西。让我们看一个完全配置的编辑器示例。

## **配置编辑器**

要添加您的配置，请将[具有设置的对象](https://tiptap.dev/api/editor)传递给`Editor`类，如下所示：

```jsx
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    Document,
    Paragraph,
    Text,
  ],
  content: '<p>Example Text</p>',
  autofocus: true,
  editable: true,
  injectCSS: false,
})
```

这将执行以下操作：

1. 将 Tiptap 绑定到`.element`
2. 加载`DocumentParagraphText`和扩展`Paragraph`，`Text`
3. 设置初始内容
4. 初始化后将光标放在编辑器中
5. 使文本可编辑（但这是默认设置），以及
6. [禁用默认 CSS](https://github.com/ueberdosis/tiptap/tree/main/packages/core/src/style.ts)的加载（无论如何都不多）。

## **节点、标记和扩展**

大多数编辑功能都捆绑为[node](https://tiptap.dev/api/nodes)、[mark](https://tiptap.dev/api/marks)或[extension](https://tiptap.dev/api/extensions)。导入您需要的内容并将它们作为数组传递给编辑器。

这是只有三个扩展的最小设置：

```jsx
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    Document,
    Paragraph,
    Text,
  ],
})
```

### **配置扩展**

大多数扩展都可以配置。添加一个`.configure()`并将一个对象传递给它。

以下示例将禁用默认标题级别 4、5 和 6，只允许 1、2 和 3：

```jsx
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
  ],
})
```

查看您正在使用的扩展的文档以了解有关其设置的更多信息。

### **默认扩展**

我们已经将一些最常见的扩展捆绑到一个`StarterKit`扩展中。以下是您如何使用它：

```jsx
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit,
  ],
})
```

您甚至可以将所有包含的扩展的配置作为对象传递。只需在配置前加上扩展名：

```jsx
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
})
```

该`StarterKit`扩展加载最常见的扩展，但不是所有可用的扩展。如果要加载其他扩展或添加自定义扩展，请将它们添加到`extensions`数组中：

```jsx
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'

new Editor({
  extensions: [
    StarterKit,
    Strike,
  ],
})
```

不想从加载特定扩展`StarterKit`？只需传递`false`给配置：

```jsx
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      history: false,
    }),
  ],
})
```

您可能会在协作编辑示例中看到类似的内容。`[Collaboration](https://tiptap.dev/api/extensions/collaboration)`带有自己的历史扩展。您需要删除或禁用默认`[History](https://tiptap.dev/api/extensions/history)`扩展以避免冲突。