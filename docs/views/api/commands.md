# Commands

[[toc]]

编辑器提供了大量命令以编程方式添加或更改内容或更改选择。如果您想构建自己的编辑器，您肯定想了解更多关于它们的信息。

## 执行命令

所有可用的命令都可以通过编辑器实例访问。假设您希望在用户单击按钮时将文本设为粗体。这就是它的样子：

```js
editor.commands.setBold()
```

虽然这非常好并且确实使所选内容变为粗体，但您可能希望在一次运行中更改多个命令。让我们来看看它是如何工作的。

## 连锁命令

大多数命令都可以合并到一个调用中。在大多数情况下，这比单独的函数调用要短。以下是将所选文本设为粗体的示例：

```js
editor
  .chain()
  .focus()
  .toggleBold()
  .run()
```

`.chain()`需要启动一个新链并且`.run()`需要实际执行其间的所有命令。

在上面的示例中，同时执行了两个不同的命令。当用户单击内容外的按钮时，编辑器不再处于焦点中。这就是为什么您可能想要添加`.focus()`对大多数命令的调用。它将焦点带回编辑器，因此用户可以继续输入。

所有链接的命令都在排队。它们合并为一个事务。也就是说，内容只更新一次，`update`事件也只触发一次。

## 链接内部自定义命令

链接命令时，事务会被阻止。如果你想在你的自定义命令中链接命令，你需要使用所述事务并添加到它。以下是您将如何做到这一点：

```js
addCommands() {
  return {
    customCommand: attributes => ({ chain }) => {
      // Doesn’t work:
      // return editor.chain() …

      // Does work:
      return chain()
        .insertContent('foo!')
        .insertContent('bar!')
        .run()
    },
  }
}
```

## 内联命令

在某些情况下，在命令中加入更多逻辑会很有帮助。这就是为什么你可以在命令中执行命令。我知道，这听起来很疯狂，但让我们看一个例子：

```js
editor
  .chain()
  .focus()
  .command(({ tr }) => {
    // manipulate the transaction
    tr.insertText('hey, that’s cool!')

    return true
  })
  .run()
```

## 命令试运行

有时，您不想实际运行命令，而只想知道是否可以运行命令，例如在菜单中显示或隐藏按钮。这就是我们添加`.can()`的目的。此方法之后的所有内容都将被执行，而不会将更改应用于文档：

```js
editor
  .can()
  .toggleBold()
```

您也可以将它与 一起使用`.chain()`。这是一个检查是否可以应用所有命令的示例：

```js
editor
  .can()
  .chain()
  .toggleBold()
  .toggleItalic()
  .run()
```

`true`如果可以应用命令，这两个调用都会返回，如果不能的`false`话。

为了使其与您的自定义命令一起使用，请不要忘记返回`true`或`false`。

对于您自己的一些命令，您可能希望使用原始[事务](https://tiptap.dev/api/introduction)。为了使它们与您一起工作，`.can()`您应该检查是否应该发送交易。以下是创建简单`.insertText()`命令的方法：

```js
export default (value) => ({ tr, dispatch }) => {
  if (dispatch) {
    tr.insertText(value)
  }

  return true
}
```

如果您只是包装另一个 Tiptap 命令，则无需检查，我们会为您完成。

```js
addCommands() {
  return {
    bold: () => ({ commands }) => {
      return commands.toggleMark('bold')
    },
  }
}
```

如果你只是包装一个普通的 ProseMirror 命令，你`dispatch`无论如何都需要通过。然后也没有必要检查它：

```js
import { exitCode } from 'prosemirror-commands'

export default () => ({ state, dispatch }) => {
  return exitCode(state, dispatch)
}
```

## 尝试命令

如果要运行命令列表，但只想应用第一个成功的命令，则可以使用`.first()`方法执行此操作。此方法一个接一个地运行命令，并在第一个返回`true`.

例如，退格键首先尝试撤消输入规则。如果成功，它就停在那里。如果没有应用输入规则因此无法恢复，它会运行下一个命令并删除选择（如果有的话）。这是简化的示例：

```js
editor.first(({ commands }) => [
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
  // …
])
```

在命令内部你可以做同样的事情：

```js
export default () => ({ commands }) => {
  return commands.first([
    () => commands.undoInputRule(),
    () => commands.deleteSelection(),
    // …
  ])
}
```

查看下面列出的所有核心命令。他们应该给您关于可能性的良好第一印象。

## 内容

### clearContent()

**清除整个文档。**

请记住，编辑器将强制执行配置的架构，并且文档不会是null. 默认情况下Document期望至少有一个块节点，默认情况下是段落。换句话说：即使运行该命令后，文档也将至少有一个（空）段落。

另请参阅：`setContent`、`insertContent`

语法:
```js
emitUpdate: boolean(false)
```

默认情况下，它不会触发更新事件。传递true不会阻止触发更新事件。


### insertContent
**在当前位置插入一个节点或 HTML 字符串。**

该insertContent命令将传递的值添加到文档中。

另请参阅：setContent、clearContent

参数:
```js
value: Content
```
该命令非常灵活，可以接受纯文本、HTML 甚至 JSON 作为值。

语法:
```js
// Plain text
editor.commands.insertContent('Example Text')

// HTML
editor.commands.insertContent('<h1>Example Text</h1>')

// HTML with trim white space
editor.commands.insertContent('<h1>Example Text</h1>',
{
  parseOptions: {
    preserveWhitespace: false,
  }
})

// JSON/Nodes
editor.commands.insertContent({
  type: 'heading',
  attrs: {
    level: 1,
  },
  content: [
    {
      type: 'text',
      text: 'Example Text',
    },
  ],
})

// Multiple nodes at once
editor.commands.insertContent([
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'First paragraph',
      },
    ],
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Second paragraph',
      },
    ],
  },
])
```

### insertContentAt
**在特定位置插入一个节点或 HTML 字符串。**

将insertContentAt在给定位置或范围插入一个 html 字符串或一个节点。如果给定了范围，则新内容将用新内容替换给定范围内的内容。

语法:
```js
editor.commands.insertContentAt(12, '<p>Hello world</p>', {
  updateSelection: true,
  parseOptions: {
    preserveWhitespace: 'full',
  }
})
```

参数:
```js
position: number | Range
```
内容将插入的位置或范围。
```js
value: Content
```
要插入的内容。可以是 HTML 字符串或节点。
```js
options: Record<string, any>
```
- updateSelection：控制是否应将所选内容移动到新插入的内容。
- parseOptions：传递的内容由 ProseMirror 解析。要挂钩解析，您可以传递然后由ProseMirrorparseOptions处理的内容。

### setContent
**用新内容替换整个文档。**

该setContent命令用新文档替换该文档。您可以传递 JSON 或 HTML，两者都可以正常工作。与设置 on 初始化基本相同content。

另请参阅：insertContent、clearContent

语法:
```js
// HTML
editor.commands.setContent('<p>Example Text</p>')

// JSON
editor.commands.setContent({
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Example Text"
        }
      ]
    }
  ]
})
```

参数:
```js
content: string
```
传递字符串（JSON 或 HTML）作为content。编辑器只会渲染schema允许的内容。
```js
emitUpdate?: Boolean (false)
```
默认情况下，它不会触发更新事件。传递true不会阻止触发更新事件。
```js
parseOptions?: Record<string, any>
```
配置解析的选项可以在初始化期间和/或使用 setContent 传递。在ProseMirror 文档中阅读有关 parseOptions 的更多信息。

## 节点和标记

### clearNodes
**将节点规范化为一个简单的段落。**

该clearNodes命令将节点标准化为默认节点，即默认的段落。它甚至可以标准化所有类型的列表。对于高级用例，在应用新节点类型之前它可以派上用场。

如果您想知道如何定义默认节点：这取决于content您的属性中的内容Document，默认情况下block+（至少一个块节点）并且该Paragraph节点具有最高优先级，因此它首先加载，因此是默认节点。

语法：
```js
editor.commands.clearNodes()
```

### createParagraphNear
**附近创建一个段落**

如果当前选择了块节点，则该createParagraphNear命令会在当前选择的块节点后创建一个空段落。如果所选块节点是其父节点的第一个子节点，则新段落将插入到当前选择之前。

语法:
```js
editor.commands.createParagraphNear()
```

### deleteNode
**删除一个节点。**

该deleteNode命令删除当前选择内的节点。它需要一个typeOrName参数，可以是字符串或aNodeType来查找需要删除的节点。删除节点后，视图会自动滚动到光标位置。

语法：
```js
// deletes a paragraph node
editor.commands.deleteNode('paragraph')

// or

// deletes a custom node
editor.commands.deleteNode(MyCustomNode)
```
参数：
```js
typeOrName: string | NodeType
```

### exitCode
从代码块中退出。

exitCode如果选择是一个元素，该命令将在当前选择之后创建一个默认块code，并将光标移动到新块。

语法:
```js
editor.commands.exitCode()
```

### extendMarkRange
将文本选择扩展到当前标记

该extendMarkRange命令扩展当前选择以包含当前标记。如果当前选择没有指定的标记，则不会发生任何变化。

语法:
```js
// Expand selection to link marks
editor.commands.extendMarkRange('link')

// Expand selection to link marks with specific attributes
editor.commands.extendMarkRange('link', { href: 'https://google.com' })

// Expand selection to link mark and update attributes
editor
  .chain()
  .extendMarkRange('link')
  .updateAttributes('link', {
    href: 'https://duckduckgo.com'
  })
  .run()
```

参数:
```js
typeOrName: string | MarkType
```
标记的名称或类型。
```js
attributes?: Record<string, any>
```
或者，您可以指定扩展标记必须包含的属性。

### joinBackward
**向后加入两个节点。**

该joinBackward命令从当前选择向后连接两个节点。如果选择为空并且位于文本块的开头，joinBackward将尝试缩短该块与其前面的块之间的距离。

语法:
```js
editor.commands.joinBackward()
```

### joinForward
**向前加入两个节点**

该joinForward命令从当前选择向前连接两个节点。如果选择为空并且位于文本块的末尾，joinForward将尝试减少该块与其后面的块之间的距离。

语法:
```js
editor.commands.joinForward()
```

### liftEmptyBlock
**如果是空的，则提升块。**

如果当前选定的块是空文本块，请在可能的情况下将其抬起。提升意味着该块将被移动到其当前所在块的父级。

语法:
```js
editor.commands.liftEmptyBlock()
```

### lift
**删除现有包装。**

该lift命令将给定节点提升到其父节点。提升意味着该块将被移动到其当前所在块的父级。

语法:
```js
// lift any headline
editor.commands.lift('headline')

// lift only h2
editor.commands.lift('headline', { level: 2 })
```

参数:
```js
typeOrName: String | NodeType
```
应该提升的节点。如果在当前选择中未找到该节点，则忽略该命令。
```js
attributes: Record<string, any>
```
节点应该必须提升的属性。这是可选的。

### newlineInCode
**将某些节点或标记属性重置为默认值。**

newlineInCode在当前代码块中插入新行。如果设置了选择，则该选择将替换为换行符。

语法:
```js
editor.commands.newlineInCode()
```

### resetAttributes
**添加具有新属性的标记。**

resetAttributes将某些节点属性重置回默认属性。

语法:
```js
// 重置当前选定段落节点上的样式和类属性
editor.commands.resetAttributes('paragraph', ['style', 'class'])
```

参数:
```js
typeOrName: string | Node
```
应重置的节点。可以是字符串或节点。
```js
attributes: string | string[]
```
定义应重置哪些属性的字符串或字符串数​​组。

### setMark
**用节点替换给定范围。**

该setMark命令将在当前选择处添加一个新标记。

语法:
```js
editor.commands.setMark("bold", { class: 'bold-tag' })
```

参数:
```js
typeOrName: string | MarkType
```
要添加的标记的类型。可以是字符串或 MarkType。
```js
attributes: Record<string, any>
```
应应用于标记的属性。这是可选的。

### setMeta
**在当前事务中存储元数据属性。**

语法:
```js
// 防止更新事件被触发
editor.commands.setMeta('preventUpdate', true)

// 存储当前事务中的任何值。
// 你可以在任何时候使用tr.getMeta('foo')获取这个值。
editor.commands.setMeta('foo', 'bar')
```

### setNode
**从现有节点派生新节点。**

该setNode命令将用给定节点替换给定范围。范围取决于当前的选择。重要提示：目前setNode仅支持文本块节点。

语法:
```js
editor.commands.setNode("paragraph", { id: "paragraph-01" })
```

参数:
```js
typeOrName: string | NodeType
```
将替换范围的节点的类型。可以是字符串或 NodeType。
```js
attributes?: Record<string, any>
```
应应用于节点的属性。这是可选的。

### splitBlock
**打开和关闭标记。**

splitBlock将在当前NodeSelection处将当前节点拆分为两个节点。如果当前选择不可分割，则该命令将被忽略。

语法:
```js
// 拆分当前节点并保留标记
editor.commands.splitBlock()

// 拆分当前节点，不保留标记
editor.commands.splitBlock({ keepMarks: false })
```

参数:
```js
options: Record<string, any>
```
keepMarks: boolean- 定义是否应保留或删除标记。默认为true.

### toggleWrap
**将节点包装在另一个节点中，或删除现有的包装。**

toggleWrap用新节点包装当前节点或删除包装节点。

语法:
```js
// 切换当前选择与标题节点
editor.commands.toggleWrap('heading', { level: 1 })
```

参数:
```js
typeOrName: string | NodeType
```
应用于包装节点的节点类型。
```js
attributes?: Record<string, any>
```
应应用于节点的属性。这是可选的。

### undoInputRule
**撤消输入规则。**

undoInputRule将撤消最近触发的输入规则。

语法:
```js
editor.commands.undoInputRule()
```

### unsetAllMarks
**删除当前选择中的所有标记。**

语法:
```js
editor.commands.unsetAllMarks()
```

### unsetMark
**删除当前选择中的标记。**

unsetMark将从当前选择中删除该标记。还可以删除当前选择中的所有标记。

语法:
```js
// 删除粗体标记
editor.commands.unsetMark('bold')

// 删除当前选定内容中的粗体标记
editor.commands.unsetMark('bold', { extendEmptyMarkRange: true })
```

参数:
```js
typeOrName: string | MarkType
```
应删除的标记类型。
```js
options?: Record<string, any>
```
- extendEmptyMarkRange?: boolean- 即使当前选择也删除标记。默认为false

### updateAttributes
**更新节点或标记的属性。**

该updateAttributes命令将节点或标记的属性设置为新值。未传递的属性不会被触及。

另请参阅：extendMarkRange

语法:
```js
// Update node attributes
editor.commands.updateAttributes('heading', { level: 1 })

// Update mark attributes
editor.commands.updateAttributes('highlight', { color: 'pink' })
```

参数:
```js
typeOrName: string | NodeType | MarkType
```
传递您要更新的类型，例如'heading'.
```js
attributes: Record<string, any>
```
这需要一个具有需要更新属性的对象。它不需要具有所有属性。

## 列表

### forEach

**循环遍历项目数组。**

语法:
```js
const items = ['foo', 'bar', 'baz']

editor.commands.forEach(items, (item, { commands }) => {
  return commands.insertContent(item)
})
```

参数:
```js
items: any[]
```
一系列项目。
```js
fn: (item: any, props: CommandProps & { index: number }) => boolean
```
可以对您的物品执行任何操作的功能。

### liftListItem
**将列表项提升到包装列表中。**

将liftListItem尝试将当前选择周围的列表项提升到包装父列表中。

语法:
```js
editor.commands.liftListItem()
```

### sinkListItem
**将列表项下沉到内部列表中。**

将sinkListItem尝试将当前选择周围的列表项下沉到包装子列表中。

语法:
```js
editor.commands.sinkListItem()
```

### splitListItem
**将一个列表项拆分为两个列表项。**

splitListItem将一个列表项拆分为两个单独的列表项。如果这是一个嵌套列表，则应拆分包装列表项。

语法:
```js
editor.commands.splitListItem('bullet_list')
```

参数:
```js
typeOrName: string | NodeType
```
应拆分为两个单独的列表项的节点类型。

### toggleList
**在不同的列表类型之间切换。**

语法:
```js
// 切换项目符号列表与列表项
editor.commands.toggleList('bullet_list', 'list_item')

// 切换带有列表项的编号列表
editor.commands.toggleList('ordered_list', 'list_item')
```

参数:
```js
listTypeOrName: string | NodeType
```
用于包装列表的节点类型
```js
itemTypeOrName: string | NodeType
```
应用于列表项的节点类型
```js
keepMarks?: boolean
```
标记是否应保留为列表项
```js
attributes?: Record<string, any>
```
应应用于列表的属性。这是可选的。

### toggleMark
**将一个节点与另一个节点切换。**

该toggleMark命令在当前选择处打开和关闭特定标记。

语法:
```js
// 切换加粗标记
editor.commands.toggleMark('bold')

// 使用颜色属性切换加粗标记
editor.commands.toggleMark('bold', { color: 'red' })

// 切换带有颜色属性的粗体标记，并在当前选择范围内删除该标记
editor.commands.toggleMark('bold', { color: 'red' }, { extendEmptyMarkRange: true })
```

参数:
```js
typeOrName: string | MarkType
```
应切换的标记类型。
```js
attributes?: Record<string, any>
```
应应用于标记的属性。这是可选的。
```js
options?: Record<string, any>
```
- `extendEmptyMarkRange: boolean`- 即使当前选择也删除标记。默认为false

### toggleNode
**将在一个节点与另一个节点之间切换。**

语法:
```js
// 切换带有标题节点的段落
editor.commands.toggleNode('paragraph', 'heading', { level: 1 })

// 用图像节点切换段落
editor.commands.toggleNode('paragraph', 'image', { src: 'https://example.com/image.png' })
```

参数:
```js
typeOrName: string | NodeType
```
应切换的节点类型。
```js
toggleTypeOrName: string | NodeType
```
用于切换的节点类型。
```js
attributes?: Record<string, any>
```
应应用于节点的属性。这是可选的。

### wrapInList
**将节点包装在列表中。**

wrapInList将在列表中包含当前选择中的节点。

语法:
```js
// 用项目符号列表把段落包起来
editor.commands.wrapInList('paragraph')
```

参数:
```js
typeOrName: string | NodeType
```
应包含在列表中的节点类型。
```js
attributes?: Record<string, any>
```
应应用于列表的属性。这是可选的。

## 选择

### blur()
从编辑器中移除焦点。

语法:
```js
editor.commands.blur()
```

### deleteRange()
删除给定范围。

该deleteRange命令删除给定范围内的所有内容。它需要一个range类型为 的属性Range。

用法:
```js
editor.commands.deleteRange({ from: 0, to: 12 })
```

参数:
```
range: Range
```

### deleteSelection()
**删除选择，如果有的话。**

该deleteSelection命令删除当前选定的节点。如果不存在任何选择，则不会删除任何内容。

语法:
```js
editor.commands.deleteSelection()
```

### enter()
**触发输入。**

该enter命令以编程方式触发输入。

语法:
```js
editor.commands.enter()
```

### focus()
**将编辑器聚焦在给定位置。**

当用户单击编辑器外部的按钮时，浏览器会将焦点设置到该按钮。在大多数情况下，您希望再次聚焦编辑器。这就是为什么您会在基本上每个演示中看到这一点。

语法:
```js
// Set the focus to the editor
editor.commands.focus()

// Set the cursor to the first position
editor.commands.focus('start')

// Set the cursor to the last position
editor.commands.focus('end')

// Selects the whole document
editor.commands.focus('all')

// Set the cursor to position 10
editor.commands.focus(10)
```

参数:
```js
position: 'start' | 'end' | 'all' | number | boolean | null (false)
```
默认情况下，它会恢复光标位置（和文本选择）。传递光标移动到的位置。
```js
options: { scrollIntoView: boolean }
```
定义聚焦时是否滚动到光标。默认为true.

### keyboardShortcut
**触发键盘快捷键。**

该keyboardShortcut命令将尝试触发具有给定名称的 ShortcutEvent。

语法:
```js
editor.commands.keyboardShortcut('undo')
```

参数:
```js
name: String
```
要触发的快捷方式的名称。

### scrollIntoView
**将选择滚动到视图中。**

scrollIntoView将视图滚动到当前选择或光标位置。

语法:
```js
editor.commands.scrollIntoView()
```

### selectAll
**选择整个文档。**

语法:
```js
// Select the whole document
editor.commands.selectAll()
```

### selectNodeBackward
**向后选择一个节点。**

如果选择为空并且位于文本块的开头，selectNodeBackward则如果可能，将选择当前文本块之前的节点。

语法:
```js
editor.commands.selectNodeBackward()
```

### selectNodeForward
**向前选择一个节点。**

如果选择为空并且位于文本块的末尾，selectNodeForward则将选择当前文本块之后的节点（如果可能）。

语法:
```js
editor.commands.selectNodeForward()
```

### selectParentNode
**选择父节点。**

selectParentNode将尝试获取当前所选节点的父节点并将选择移动到该节点。

语法:
```js
editor.commands.selectParentNode()
```

### selectTextblockEnd
**将光标移动到该文本块的末尾**

如果当前文本块是有效的文本块，则会selectTextblockEnd将光标移动到该文本块的末尾。

语法:
```js
editor.commands.selectTextblockEnd()
```

### selectTextblockStart
**将光标移动到当前文本块的开头**

如果当前文本块是有效的文本块，则会selectTextblockStart将光标移动到当前文本块的开头。

语法:
```js
editor.commands.selectTextblockStart()
```

### setNodeSelection
**创建一个节点选择。**

setNodeSelection在给定位置创建一个新的 NodeSelection。节点选择是指向单个节点的选择。查看更多

语法:
```js
editor.commands.setNodeSelection(10)
```

参数:
```js
position: number
```
将创建 NodeSelection 的位置。

### setTextSelection
**创建一个文本选择。**

如果您在编辑器的上下文中考虑选择，您可能会想到文本选择。您setTextSelection可以控制文本选择并将其设置为指定的范围或位置。

另请参阅：focus、setNodeSelection、deleteSelection、selectAll

语法:
```js
// 将光标置于指定位置
editor.commands.setTextSelection(10)

// 将文本选择设置为指定的范围
editor.commands.setTextSelection({ from: 5, to: 10 })
```

参数:
```js
position: number | Range
```
传递一个数字或一个范围，例如`{ from: 5, to: 10 }`。

## 编写自己的命令

所有扩展都可以添加额外的命令（大多数都可以），查看[提供的节点](https://tiptap.dev/api/nodes)、[标记](https://tiptap.dev/api/marks)和[扩展](https://tiptap.dev/api/extensions)的特定文档以了解更多信息。当然，您也可以使用自定义命令[添加自定义扩展。](https://tiptap.dev/guide/custom-extensions)