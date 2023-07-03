# 自定义扩展

[[toc]]

Tiptap 的优势之一是它的可扩展性。您不依赖于提供的扩展，它旨在根据您的喜好扩展编辑器。

使用自定义扩展，您可以在现有内容之上或从头开始添加新的内容类型和新功能。让我们从几个常见示例开始，说明如何扩展现有节点、标记和扩展。

最后，您将了解如何从头开始，但您将需要相同的知识来扩展现有的和创建新的扩展。

## **扩展现有的扩展**

每个扩展都有一个`extend()`方法，它接受一个对象，其中包含您想要更改或添加的所有内容。

比方说，您想更改项目符号列表的键盘快捷键。您应该从查看扩展的源代码开始，在这种情况下[是`BulletList`node](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bullet-list/src/bullet-list.ts)。对于覆盖键盘快捷键的定制示例，您的代码可能如下所示：

```jsx
// 1. Import the extension
import BulletList from '@tiptap/extension-bullet-list'

// 2. Overwrite the keyboard shortcuts
const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.toggleBulletList(),
    }
  },
})

// 3. Add the custom extension to your editor
new Editor({
  extensions: [
    CustomBulletList(),
    // …
  ],
})
```

这同样适用于现有扩展的各个方面，但名称除外。让我们看看您可以通过扩展方法更改的所有内容。我们在每个示例中都专注于一个方面，但您也可以组合所有这些示例并在一次`extend()`调用中更改多个方面。

### **Name**

扩展名称用在很多地方，更改它并不容易。如果要更改现有扩展的名称，可以复制整个扩展并更改所有出现的名称。

扩展名称也是 JSON 的一部分。如果您[将内容存储为 JSON](https://tiptap.dev/guide/output#option-1-json)，则还需要更改那里的名称。

### group

`group` 是用于对节点进行分类和分组的属性。它允许你将节点按照其特性、类型或用途进行逻辑分组，方便对节点进行管理和操作。

`group` 可以是一个字符串或一个字符串数组，用于指定节点所属的分组。一个节点可以属于一个或多个分组，具体取决于你的需求和设计。

以下是一些常见的分组示例：

1. 块级节点分组：用于表示段落、标题、列表等块级元素。例如：`group: 'block'`。
2. 内联节点分组：用于表示加粗、斜体、超链接等内联元素。例如：`group: 'inline'`。
3. 内容节点分组：用于表示嵌套的内容节点，如列表项、表格行等。例如：`group: 'content'`。
4. 特殊节点分组：用于表示特定的节点类型，如图片、视频等。例如：`group: 'special'`。

使用 `group` 属性可以在编辑器中方便地对节点进行管理和应用样式或操作。通过指定相同的分组，你可以将具有相似特性的节点进行关联，并针对性地进行处理。

例如，你可以通过分组来定义自定义菜单、快捷键、样式等，以便根据节点的分组应用不同的行为或样式。

下面是一个使用 `group` 属性的示例：

```jsx
import { Node } from '@tiptap/core';

const myNode = Node.create({
  name: 'myNode',
  group: 'block', // 将节点分组为 'block'
});
```

在上述示例中，我们创建了一个名为 `myNode` 的节点，并将其分组为 `'block'`。这意味着该节点将被视为块级节点。

请注意，`group` 属性的具体取值可以根据你的需求和设计进行自定义。通常使用的节点分组包括 `'block'`、`'inline'`、`'text'` 等，但你也可以根据自己的需要创建自定义的分组。

### content

`Node.create` 方法用于创建一个节点。节点的 `content` 属性用于指定节点所包含的内容。

`content` 属性可以接受多种不同的值来定义节点的内容：

1. 字符串：指定节点的内容类型。例如，`content: 'inline'` 表示节点的内容是一个内联节点。
2. `Content` 对象：指定节点的内容类型和相关配置。例如，`content: inline()` 表示节点的内容是一个内联节点，并且可以包含其他内联节点。
3. 函数：动态指定节点的内容。函数接收一个 `node` 参数，用于访问当前节点的信息，并返回一个表示节点内容的配置。

下面是一些示例：

1. 字符串：

    ```jsx
    const myNode = Node.create({
      name: 'myNode',
      content: 'inline', // 节点的内容是一个内联节点
    });
    ```

2. `Content` 对象：

    ```jsx
    import { Node, inline } from '@tiptap/core';

    const myNode = Node.create({
      name: 'myNode',
      content: inline(), // 节点的内容是一个内联节点，并且可以包含其他内联节点
    });
    ```

3. 函数：

    ```jsx
    const myNode = Node.create({
      name: 'myNode',
      content: (node) => {
        if (node.type.name === 'paragraph') {
          return 'text'; // 如果父节点是段落节点，则节点的内容是纯文本
        } else {
          return 'inline'; // 其他情况下节点的内容是内联节点
        }
      },
    });
    ```


请根据你的具体需求选择合适的方式来定义节点的内容。

### **defining**

`Node.create` 方法用于创建一个节点。`defining` 属性用于指定节点是否是定义节点（defining node）。

定义节点是一种特殊类型的节点，它用于在编辑器中插入或编辑新的节点。当一个定义节点被创建时，它会被立即替换为实际的内容，并且用户可以在编辑器中对其进行编辑。

`defining` 属性接受布尔值作为参数，表示节点是否是定义节点。默认情况下，节点是非定义节点，即 `defining: false`。

下面是一个示例：

```jsx
const myNode = Node.create({
  name: 'myNode',
  defining: true, // 将节点设置为定义节点
});
```

当你将一个定义节点插入到编辑器中时，它会被替换为实际的内容节点。用户可以编辑这个内容节点，并在编辑完成后将其保存回定义节点中。

请根据你的需求决定是否需要将节点设置为定义节点。

### **Priority**

优先级定义了扩展注册的顺序。默认优先级是`100`，这是大多数扩展所具有的。具有更高优先级的扩展将被更早地加载。

```jsx
import Link from '@tiptap/extension-link'

const CustomLink = Link.extend({
  priority: 1000,
})
```

加载扩展的顺序会影响两件事：

1. **插件顺序**

    具有更高优先级的扩展的 ProseMirror 插件将首先运行。

2. **架构顺序**

    例如，`[Link](https://tiptap.dev/api/marks/link)`标记具有更高的优先级，这意味着它将呈现为`<a href="…"><strong>Example</strong></a>`而不是`<strong><a href="…">Example</a></strong>`。


### **Settings**

无论如何都可以通过扩展配置所有设置，但是如果你想更改默认设置，例如为其他开发人员在 Tiptap 之上提供一个库，你可以这样做：

```jsx
import Heading from '@tiptap/extension-heading'

const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3],
    }
  },
})
```

### **Storage**

在某些时候，您可能希望在扩展实例中保存一些数据。此数据是可变的。您可以在 下的扩展中访问它`this.storage`。

```jsx
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addStorage() {
    return {
      awesomeness: 100,
    }
  },

  onUpdate() {
    this.storage.awesomeness += 1
  },
})
```

在扩展程序之外，您可以通过`editor.storage`. 确保每个扩展名都有唯一的名称。

```jsx
const editor = new Editor({
  extensions: [
    CustomExtension,
  ],
})

const awesomeness = editor.storage.customExtension.awesomeness
```

### **Schema**

tiptap 使用严格的架构，配置内容的结构、嵌套方式、行为方式以及更多内容。您可以更改现有扩展[架构的所有方面。](https://tiptap.dev/api/schema)让我们来看看一些常见的用例。

默认`Blockquote`扩展可以包装其他节点，如标题。如果你只想在你的块引用中只允许段落，请`content`相应地设置属性：

```jsx
// Blockquotes must only include paragraphs
import Blockquote from '@tiptap/extension-blockquote'

const CustomBlockquote = Blockquote.extend({
  content: 'paragraph*',
})
```

该模式甚至允许使您的节点可拖动，这就是该`draggable`选项的用途。它默认为`false`，但您可以覆盖它。

```jsx
// Draggable paragraphs
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
  draggable: true,
})
```

这只是两个小例子，但[底层的 ProseMirror 模式](https://prosemirror.net/docs/ref/#model.SchemaSpec)非常强大。

### **Attributes**

您可以使用属性在内容中存储附加信息。假设您想扩展默认`Paragraph`节点以具有不同的颜色：

```jsx
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    // Return an object with attribute configuration
    return {
      color: {
        default: 'pink',
      },
    },
  },
})

// Result:
// <p color="pink">Example Text</p>
```

这已经足以将新属性告知 Tiptap，并将其设置`'pink'`为默认值。默认情况下，所有属性都将呈现为 HTML 属性，并在启动时从内容中解析。

让我们继续使用颜色示例，并假设您想要添加一个内联样式来实际为文本着色。使用该`renderHTML`函数，您可以返回将在输出中呈现的 HTML 属性。

此示例根据以下值添加样式 HTML 属性`color`：

```jsx
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        // Take the attribute values
        renderHTML: attributes => {
          // … and return an object with HTML attributes.
          return {
            style: `color: ${attributes.color}`,
          }
        },
      },
    }
  },
})

// Result:
// <p style="color: pink">Example Text</p>
```

您还可以控制如何从 HTML 解析属性。也许您想将颜色存储在一个名为`data-color`（而不仅仅是`color`）的属性中，下面是您将如何做到这一点：

```jsx
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: element => element.getAttribute('data-color'),
        // … and customize the HTML rendering.
        renderHTML: attributes => {
          return {
            'data-color': attributes.color,
            style: `color: ${attributes.color}`,
          }
        },
      },
    }
  },
})

// Result:
// <p data-color="pink" style="color: pink">Example Text</p>
```

您可以使用 完全禁用属性的呈现`rendered: false`。

### **Extend existing attributes**

如果要向扩展添加属性并保留现有属性，您可以通过 访问它们`this.parent()`。

在某些情况下，它是未定义的，因此请确保检查这种情况，或使用可选链接`this.parent?.()`

```jsx
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      myCustomAttribute: {
        // …
      },
    }
  },
})
```

### **Global attributes**

属性可以一次应用于多个扩展。这对于文本对齐、行高、颜色、字体系列和其他与样式相关的属性很有用。

仔细查看扩展[的完整源代码](https://github.com/ueberdosis/tiptap/tree/main/packages/extension-text-align)以`[TextAlign](https://tiptap.dev/api/extensions/text-align)`查看更复杂的示例。但简而言之，它是如何工作的：

```jsx
import { Extension } from '@tiptap/core'

const TextAlign = Extension.create({
  addGlobalAttributes() {
    return [
      {
        // Extend the following extensions
        types: [
          'heading',
          'paragraph',
        ],
        // … with those attributes
        attributes: {
          textAlign: {
            default: 'left',
            renderHTML: attributes => ({
              style: `text-align: ${attributes.textAlign}`,
            }),
            parseHTML: element => element.style.textAlign || 'left',
          },
        },
      },
    ]
  },
})
```

### **Render HTML**

使用该`renderHTML`函数，您可以控制如何将扩展呈现为 HTML。我们将一个属性对象传递给它，其中包含所有本地属性、全局属性和配置的 CSS 类。这是`Bold`扩展的一个例子：

```jsx
renderHTML({ HTMLAttributes }) {
  return ['strong', HTMLAttributes, 0]
},
```

数组中的第一个值应该是 HTML 标签的名称。如果第二个元素是一个对象，它被解释为一组属性。之后的任何元素都呈现为子元素。

数字零（代表一个洞）用于指示应该插入内容的位置。`CodeBlock`让我们看一下带有两个嵌套标签的扩展的渲染：

```jsx
renderHTML({ HTMLAttributes }) {
  return ['pre', ['code', HTMLAttributes, 0]]
},
```

如果您想在那里添加一些特定的属性，请从以下位置导入`mergeAttributes`帮助程序`@tiptap/core`：

```jsx
import { mergeAttributes } from '@tiptap/core'

// ...

renderHTML({ HTMLAttributes }) {
  return ['a', mergeAttributes(HTMLAttributes, { rel: this.options.rel }), 0]
},
```

### **Parse HTML**

该`parseHTML()`函数尝试从 HTML 加载编辑器文档。该函数获取作为参数传递的 HTML DOM 元素，并期望返回具有属性及其值的对象。这是`[Bold](https://tiptap.dev/api/marks/bold)`标记中的一个简化示例：

```jsx
parseHTML() {
  return [
    {
      tag: 'strong',
    },
  ]
},
```

这定义了将所有`<strong>`标签转换为`Bold`标记的规则。但是你可以得到更高级的，这里是扩展的完整示例：

```jsx
parseHTML() {
  return [
    // <strong>
    {
      tag: 'strong',
    },
    // <b>
    {
      tag: 'b',
      getAttrs: node => node.style.fontWeight !== 'normal' && null,
    },
    // <span style="font-weight: bold"> and <span style="font-weight: 700">
    {
      style: 'font-weight',
      getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
    },
  ]
},
```

这会检查`<strong>`和`<b>`标记，以及任何具有内联样式的 HTML 标记，并将其设置`font-weight`为粗体。

如您所见，您可以选择传递`getAttrs`回调，以添加更复杂的检查，例如针对特定 HTML 属性。回调被传递给 HTML DOM 节点，除了检查`style`属性时，它就是值。

你想知道那是`&& null`做什么的？[ProseMirror 期望`null`or`undefined`如果检查成功。](https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.getAttrs)

[传递`priority`给规则](https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.priority)以解决与其他扩展的冲突，例如，如果您构建一个自定义扩展来查找具有类属性的段落，但您已经使用了默认的段落扩展。

### **Using getAttrs**

`getAttrs`您可能已经注意到示例中的函数有两个用途：

1. 检查 HTML 属性以确定规则是否匹配（并根据该 HTML 创建标记或节点）。当函数返回时`false`，它不匹配。
2. 获取 DOM 元素并使用 HTML 属性相应地设置标记或节点属性：

```jsx
parseHTML() {
  return [
    {
      tag: 'span',
      getAttrs: element => {
        // Check if the element has an attribute
        element.hasAttribute('style')
        // Get an inline style
        element.style.color
        // Get a specific attribute
        element.getAttribute('data-color')
      },
    },
  ]
},
```

您可以返回一个以属性为键的对象和解析的值来设置您的标记或节点属性。不过，我们建议使用`parseHTML`inside `addAttributes()`。这将使您的代码更清晰。

```jsx
addAttributes() {
  return {
    color: {
      // Set the color attribute according to the value of the `data-color` attribute
      parseHTML: element => element.getAttribute('data-color'),
    }
  }
},
```

[在ProseMirror 参考](https://prosemirror.net/docs/ref/#model.ParseRule)中阅读有关`getAttrs`所有其他`ParseRule`属性的更多信息。

### **Commands**

```jsx
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
  addCommands() {
    return {
      paragraph: () => ({ commands }) => {
        return commands.setNode('paragraph')
      },
    }
  },
})
```

**在 addCommands 中使用命令参数**

要访问内部的其他命令，`addCommands`请使用`commands`传递给它的参数。

### **Keyboard shortcuts**

大多数核心扩展都带有合理的键盘快捷键默认值。根据您想要构建的内容，您可能想要更改它们。使用该`addKeyboardShortcuts()`方法，您可以覆盖预定义的快捷方式映射：

```jsx
// Change the bullet list keyboard shortcut
import BulletList from '@tiptap/extension-bullet-list'

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.toggleBulletList(),
    }
  },
})
```

### **Input rules**

使用输入规则，您可以定义正则表达式来侦听用户输入。它们用于降价快捷方式，或者例如将文本转换为带有扩展名`(c)`的`©`（以及更多） 。对标记`[Typography](https://tiptap.dev/api/extensions/typography)`使用辅助函数，对节点使用 。`markInputRulenodeInputRule`

默认情况下，两侧两个波浪号之间的文本转换为~~删除文本~~. 如果您想认为每边一个波浪号就足够了，您可以像这样覆盖输入规则：

```jsx
// Use the ~single tilde~ markdown shortcut
import Strike from '@tiptap/extension-strike'
import { markInputRule } from '@tiptap/core'

// Default:
// const inputRegex = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/

// New:
const inputRegex = /(?:^|\s)((?:~)((?:[^~]+))(?:~))$/

const CustomStrike = Strike.extend({
  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },
})
```

### **Paste rules**

粘贴规则就像输入规则（见上文）一样工作。但它们不是听用户输入的内容，而是应用于粘贴的内容。

正则表达式有一个微小的区别。输入规则通常以`$`美元符号结尾（这意味着“在一行的末尾断言位置”），粘贴规则通常会查看所有内容并且没有`$`美元符号。

以上面的示例为例并将其应用于粘贴规则，如下例所示。

```jsx
// Check pasted content for the ~single tilde~ markdown syntax
import Strike from '@tiptap/extension-strike'
import { markPasteRule } from '@tiptap/core'

// Default:
// const pasteRegex = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g

// New:
const pasteRegex = /(?:^|\s)((?:~)((?:[^~]+))(?:~))/g

const CustomStrike = Strike.extend({
  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ]
  },
})
```

### **Events**

您甚至可以将[事件侦听](https://tiptap.dev/api/events)器移动到单独的扩展。以下是所有事件的侦听器示例：

```jsx
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  onCreate() {
    // The editor is ready.
  },
  onUpdate() {
    // The content has changed.
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
  },
  onTransaction({ transaction }) {
    // The editor state has changed.
  },
  onFocus({ event }) {
    // The editor is focused.
  },
  onBlur({ event }) {
    // The editor isn’t focused anymore.
  },
  onDestroy() {
    // The editor is being destroyed.
  },
})
```

### **这有什么用？**

这些扩展不是类，但您仍然可以在`this`扩展的任何地方使用一些重要的东西。

```jsx
// Name of the extension, for example 'bulletList'
this.name

// Editor instance
this.editor

// ProseMirror type
this.type

// Object with all settings
this.options

// Everything that’s in the extended extension
this.parent
```

### **ProseMirror 插件（高级）**

毕竟，Tiptap 是建立在 ProseMirror 之上的，而 ProseMirror 也有一个非常强大的插件 API。要直接访问它，请使用`addProseMirrorPlugins()`.

### **现有插件**

您可以将现有的 ProseMirror 插件包装在 Tiptap 扩展中，如下例所示。

```jsx
import { history } from 'prosemirror-history'

const History = Extension.create({
  addProseMirrorPlugins() {
    return [
      history(),
      // …
    ]
  },
})
```

### **访问 ProseMirror API**

要挂钩事件，例如单击、双击或粘贴内容时，您可以将[事件处理程序](https://prosemirror.net/docs/ref/#view.EditorProps)`editorProps`传递给[editor](https://tiptap.dev/api/editor#editor-props)。

或者您可以将它们添加到 Tiptap 扩展中，如下例所示。

```jsx
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const EventHandler = Extension.create({
  name: 'eventHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handleClick(view, pos, event) { /* … */ },
          handleDoubleClick(view, pos, event) { /* … */ },
          handlePaste(view, event, slice) { /* … */ },
          // … and many, many more.
          // Here is the full list: https://prosemirror.net/docs/ref/#view.EditorProps
        },
      }),
    ]
  },
})
```

### **节点视图（高级）**

对于高级用例，您需要在节点内执行 JavaScript，例如围绕图像呈现复杂的界面，您需要了解节点视图。

它们真的很强大，但也很复杂。简而言之，您需要返回一个父 DOM 元素，以及一个应该在其中呈现内容的 DOM 元素。请看下面的简化示例：

```jsx
import Image from '@tiptap/extension-image'

const CustomImage = Image.extend({
  addNodeView() {
    return () => {
      const container = document.createElement('div')

      container.addEventListener('click', event => {
        alert('clicked on the container')
      })

      const content = document.createElement('div')
      container.append(content)

      return {
        dom: container,
        contentDOM: content,
      }
    }
  },
})
```

关于节点视图有很多东西需要学习，因此请转到[我们指南中关于节点视图的专门部分以](https://tiptap.dev/guide/node-views)获取更多信息。如果您正在寻找真实示例，请查看[TaskItem](https://tiptap.dev/api/nodes/task-item)节点的源代码。这是使用节点视图来呈现复选框。

## **创建新的扩展**

您可以从头开始构建自己的扩展，您知道吗？它与上述扩展现有扩展的语法相同。

### **创建节点**

如果您将文档视为一棵树，那么[节点](https://tiptap.dev/api/nodes)只是该树中的一种内容。值得学习的好例子是[Paragraph](https://tiptap.dev/api/nodes/paragraph)、[Heading](https://tiptap.dev/api/nodes/heading)或[CodeBlock](https://tiptap.dev/api/nodes/code-block)。

```jsx
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',

  // Your code goes here.
})
```

节点不必是块。它们也可以与文本内联呈现，例如[@mentions](https://tiptap.dev/api/nodes/mention)。

### **创建标记**

一个或多个标记可以应用于[节点](https://tiptap.dev/api/nodes)，例如添加内联格式。值得学习的好例子是[Bold](https://tiptap.dev/api/marks/bold),[Italic](https://tiptap.dev/api/marks/italic)和[Highlight](https://tiptap.dev/api/marks/highlight)。

```jsx
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create({
  name: 'customMark',

  // Your code goes here.
})
```

### **创建扩展**

扩展为 Tiptap 添加了新功能，您会经常在这里读到扩展一词，即使是节点和标记。但是有文字扩展。这些不能添加到架构（如标记和节点），但可以添加功能或更改编辑器的行为。

一个值得学习的好例子可能是[TextAlign](https://tiptap.dev/api/extensions/text-align).

```jsx
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  // Your code goes here.
})
```