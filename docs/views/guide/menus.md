# 菜单

[[toc]]

Tiptap 非常原始，但这是一件好事。您可以完全控制它的外观。

当我们说完全控制时，我们是认真的。您可以（并且必须）自己构建菜单。我们帮助您连接一切。

## **菜单**

该编辑器提供了一个流畅的 API 来触发命令和添加活动状态。您可以使用任何您喜欢的标记。为了使菜单的定位更容易，我们提供了一些实用程序和组件。让我们一一了解最典型的用例。

### **固定菜单**

一个固定的菜单，例如在编辑器的顶部，可以是任何东西。我们不提供这样的菜单。只需添加`<div>`带有几个`<button>`。下面将[解释](https://tiptap.dev/guide/menus#buttons)这些按钮如何触发[命令](https://tiptap.dev/api/commands)。

### **气泡菜单**

选择文本时会出现气泡[菜单。](https://tiptap.dev/api/extensions/bubble-menu)标记和样式完全取决于您。

### **浮动菜单**

[浮动菜单](https://tiptap.dev/api/extensions/floating-menu)出现在空行中。标记和样式完全取决于您。

### **斜杠命令（进行中）**

它还不是官方扩展，但是[有一个实验可以用来添加我们称之为斜线命令的东西](https://tiptap.dev/experiments/commands)。它允许您开始一个新行，`/`并会弹出一个弹出窗口以选择应添加哪个节点。

## 按钮

好的，你有你的菜单。但是你如何连接呢？

### **命令**

您已经让编辑器运行并想要添加您的第一个按钮。您需要一个`<button>`带有点击处理程序的 HTML 标记。根据您的设置，这可能类似于以下示例：

```jsx
<button onclick="editor.chain().focus().toggleBold().run()">
  Bold
</button>
```

哦，这是一个很长的命令，对吧？实际上，它是一个[命令链](https://tiptap.dev/api/commands#chain-commands)。让我们一一过一遍：

```jsx
editor.chain().focus().toggleBold().run()
```

1. `editor`应该是一个 Tiptap 实例，
2. `chain()`用于告诉编辑器你要执行多个命令，
3. `focus()`将焦点设置回编辑器，
4. `toggleBold()`将所选文本标记为粗体，或者如果已应用粗体标记，则从文本选择中删除粗体标记，并且
5. `run()`将执行链。

换句话说：这将是您的文本编辑器的典型**粗体**按钮。

哪些命令可用取决于您在编辑器中注册了哪些扩展。大多数扩展都带有`set…()`,`unset…()`和`toggle…()`命令。阅读扩展文档以查看实际可用的内容或浏览代码编辑器的自动完成功能。

### **保持专注**

您已经`focus()`在上面的示例中看到了命令。当您单击该按钮时，浏览器会聚焦该 DOM 元素，而编辑器会失去焦点。您可能想要添加`focus()`到所有菜单按钮，这样您的用户的书写流程就不会中断。

### **活动状态**

编辑器提供了一种`isActive()`方法来检查是否已将某些内容应用于所选文本。在 Vue.js 中，您可以借助该功能来切换 CSS 类：

```jsx
<button :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
  Bold
</button>
```

这会相应地切换`.is-active`类并适用于节点和标记。您甚至可以检查特定属性。这是一个带有`[Highlight](https://tiptap.dev/api/marks/highlight)`标记的示例，它忽略了不同的属性：

```jsx
editor.isActive('highlight')
```

以及比较给定属性的示例：

```jsx
editor.isActive('highlight', { color: '#ffa8a8' })
```

甚至还支持正则表达式：

```jsx
editor.isActive('textStyle', { color: /.*/ })
```

您甚至可以使用节点和标记，但只检查属性。这是`[TextAlign](https://tiptap.dev/api/extensions/text-align)`扩展名的示例：

```jsx
editor.isActive({ textAlign: 'right' })
```

如果您的选择跨越多个节点或标记，或者只有部分选择有标记，`isActive()`将返回`false`并指示没有任何活动。这就是它应该的样子，因为它允许人们立即应用一个新节点或标记到该选择。

## **用户体验**

在设计出色的用户体验时，您应该考虑一些事情。

### **辅助功能**

- 确保用户可以使用键盘浏览菜单
- 使用适当的[标题属性](https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/title)
- 使用适当的[aria 属性](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)
- 列出可用的键盘快捷键