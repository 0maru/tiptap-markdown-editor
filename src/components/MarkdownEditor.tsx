import { useState, useCallback } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { common, createLowlight } from 'lowlight'
import { EditorToolbar } from './EditorToolbar'
import { TiptapEditor } from './TiptapEditor'
import { MarkdownPreview } from './MarkdownPreview'
import { MarkdownSourceEditor } from './MarkdownSourceEditor'

const lowlight = createLowlight(common)

type EditorMode = 'wysiwyg' | 'source'

const initialContent = `# Welcome to Tiptap Markdown Editor

This is a **full-featured** markdown editor built with [Tiptap](https://tiptap.dev) and [TanStack Start](https://tanstack.com/start).

## Features

- **WYSIWYG editing** with real-time preview
- **Markdown source** editing mode
- **Export** to \`.md\` file
- Syntax highlighted **code blocks**
- **Task lists** for todos
- **Tables** support

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Task List

- [x] Setup TanStack Start
- [x] Install Tiptap
- [ ] Build something amazing

> Start editing to see the magic happen!
`

export function MarkdownEditor() {
  const [mode, setMode] = useState<EditorMode>('wysiwyg')
  const [markdownContent, setMarkdownContent] = useState(initialContent)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Markdown,
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
      Typography,
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: initialContent,
    contentType: 'markdown',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setMarkdownContent(editor.getMarkdown())
    },
  })

  const handleModeChange = useCallback(
    (newMode: EditorMode) => {
      if (!editor) return
      if (newMode === 'source' && mode === 'wysiwyg') {
        setMarkdownContent(editor.getMarkdown())
      } else if (newMode === 'wysiwyg' && mode === 'source') {
        editor.commands.setContent(markdownContent, {
          contentType: 'markdown',
        })
      }
      setMode(newMode)
    },
    [editor, mode, markdownContent],
  )

  const handleSourceChange = useCallback((value: string) => {
    setMarkdownContent(value)
  }, [])

  return (
    <div className="flex flex-col gap-0 rounded-lg border border-gray-200 bg-white shadow-sm">
      <EditorToolbar
        editor={editor}
        mode={mode}
        onModeChange={handleModeChange}
        markdownContent={markdownContent}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-x lg:divide-y-0 divide-gray-200">
        <div className="min-h-[500px]">
          {mode === 'wysiwyg' ? (
            <TiptapEditor editor={editor} />
          ) : (
            <MarkdownSourceEditor
              value={markdownContent}
              onChange={handleSourceChange}
            />
          )}
        </div>
        <div className="min-h-[500px]">
          <MarkdownPreview markdownContent={markdownContent} />
        </div>
      </div>
      {editor && (
        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
          {editor.storage.characterCount.characters()} characters
          {' / '}
          {editor.storage.characterCount.words()} words
        </div>
      )}
    </div>
  )
}
