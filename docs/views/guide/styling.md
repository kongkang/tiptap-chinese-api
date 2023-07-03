# 样式

[[toc]]

Tiptap 是无头的，这意味着没有提供样式。这也意味着，您可以完全控制编辑器的外观。以下方法允许您将自定义样式应用于编辑器。

## **选项 1：设置纯 HTML 的样式**

整个编辑器呈现在带有类的容器中`.ProseMirror`。您可以使用它来将您的样式范围限定为编辑器内容：

```css
/* Scoped to the editor */
.ProseMirror p {
  margin: 1em 0;
}
```

如果您在某处呈现存储的内容，则不会有`.ProseMirror`容器，因此您可以在全局范围内向使用的 HTML 标记添加样式：

```css
/* Global styling */
p {
  margin: 1em 0;
}
```

## **选项 2：添加自定义类**

您可以控制整个渲染，包括向所有内容添加类。

### **扩展**

`HTMLAttributes`大多数扩展允许您通过选项向呈现的 HTML 添加属性。您可以使用它来添加自定义类（或任何其他属性）。当您使用[Tailwind CSS](https://tailwindcss.com/)时，这也非常有帮助。

```jsx
new Editor({
  extensions: [
    Document,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-custom-paragraph',
      },
    }),
    Heading.configure({
      HTMLAttributes: {
        class: 'my-custom-heading',
      },
    }),
    Text,
  ],
})
```

呈现的 HTML 将如下所示：

```html
<h1 class="my-custom-heading">Example Text</p>
<p class="my-custom-paragraph">Wow, that’s really custom.</p>
```

如果已经有扩展定义的类，您的类将被添加。

### **编辑**

您甚至可以像这样将类传递给包含编辑器的元素：

```
new Editor({
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
```

### 实例

```jsx
<!-- load tailwind -->
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography/dist/typography.min.css" />

<!-- provide element -->
<div class="element"></div>

<!-- create editor -->
<script type="module">
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('.element'),
  extensions: [
    StarterKit,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
    },
  },
  content: `
    <h2>
      Hi there,
    </h2>
    <p>
      this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
  `,
})
</script>
```

## **选项 3：自定义 HTML**

或者您可以自定义扩展标记。以下示例将创建一个不呈现`<strong>`标签但呈现标签的自定义粗体扩展`<b>`：

```jsx
import Bold from '@tiptap/extension-bold'

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    // Original:
    // return ['strong', HTMLAttributes, 0]
    return ['b', HTMLAttributes, 0]
  },
})

new Editor({
  extensions: [
    // …
    CustomBold,
  ],
})
```

您应该将自定义扩展名放在单独的文件中，但我认为您明白了。