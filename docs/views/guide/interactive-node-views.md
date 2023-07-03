# 交互式节点视图

[[toc]]

节点视图是自切片面包以来最好的东西，至少如果您是定制（和面包）的粉丝。使用节点视图，您可以将交互式节点添加到编辑器中。这实际上可以是一切。如果您可以用 JavaScript 编写它，则可以在编辑器中使用它。

节点视图对于改善编辑器内的体验非常有效，但也可以在 Tiptap 的只读实例中使用。它们与设计上的 HTML 输出无关，因此您可以完全控制编辑器内的体验和输出。

## 不同类型的节点视图

根据您想要构建的内容，节点视图的工作方式略有不同，并且可以验证特定功能，但也存在陷阱。主要问题是：您的自定义节点应该是什么样子？

### 可编辑文本
是的，节点视图可以具有可编辑文本，就像常规节点一样。这很简单。光标的行为与您对常规节点的期望完全一样。现有命令与这些节点配合得很好。

```jsx
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>text</node-view>
  <p>text</p>
</div>
```

这就是TaskItem节点的工作原理。

### 不可编辑的文本
节点还可以包含不可编辑的文本。光标无法跳到这些地方，但无论如何你也不希望这样。

`Tiptapcontenteditable="false"`默认添加一个。

```jsx
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view contenteditable="false">text</node-view>
  <p>text</p>
</div>
```

这就是您呈现提及的方式，该提及不应是可编辑的。用户可以添加或删除它们，但不能删除单个字符。

Statamic 将这些用于他们的 Bard 编辑器，该编辑器在 Tiptap 内呈现复杂的模块，这些模块可以有自己的文本输入。

### 混合内容
您甚至可以混合不可编辑和可编辑文本。这对于构建复杂的东西来说非常棒，并且仍然在可编辑内容中使用粗体和斜体等标记。

但是，如果节点视图中存在其他具有不可编辑文本的元素，则光标可以跳转到那里。您可以通过手动添加contenteditable="false"到节点视图的特定部分来改进这一点。

```jsx
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>
    <div contenteditable="false">
      non-editable text
    </div>
    <div>
      editable text
    </div>
  </node-view>
  <p>text</p>
</div>
```

## 标记
但是如果您访问编辑器内容会发生什么？如果您使用 HTML，则需要告诉 Tiptap 应如何序列化您的节点。

编辑器不会导出渲染的 JavaScript 节点，对于很多用例来说，您无论如何都不会想要这样。

假设您有一个节点视图，允许用户添加视频播放器并配置外观（自动播放、控件等）。您希望界面在编辑器中而不是在编辑器的输出中执行此操作。编辑器的输出可能应该只有视频播放器。

我知道，我知道，这并不容易。请记住，您可以完全控制编辑器内的渲染和输出。

如果你存储 JSON 呢？
这不适用于 JSON。在 JSON 中，所有内容都存储为对象。无需配置与 JSON 之间的“转换”。

### 渲染 HTML
好的，您已经使用交互式节点视图设置了节点，现在您想要控制输出。即使您的节点视图非常复杂，渲染的 HTML 也可以很简单：

```jsx
renderHTML({ HTMLAttributes }) {
  return ['my-custom-node', mergeAttributes(HTMLAttributes)]
},

// Output: <my-custom-node count="1"></my-custom-node>
```

确保它是可区分的，以便更容易从 HTML 恢复内容。如果您只需要一些通用标记（例如`<div>`考虑添加`data-type="my-custom-node"`.

### 解析 HTML
这同样适用于恢复内容。您可以配置您期望的标记，这可以是与节点视图标记完全无关的东西。它只需要包含您想要恢复的所有信息。

如果您通过 注册，属性会自动恢复addAttributes。

```jsx
// Input: <my-custom-node count="1"></my-custom-node>

parseHTML() {
  return [{
    tag: 'my-custom-node',
  }]
},
```

### 渲染 JavaScript/Vue/React
但是如果您想渲染实际的 JavaScript/Vue/React 代码怎么办？考虑使用 Tiptap 渲染输出。只需将编辑器设置为editable: false，没有人会注意到您正在使用编辑器来呈现内容。:-)