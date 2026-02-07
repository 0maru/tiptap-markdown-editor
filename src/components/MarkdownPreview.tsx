import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

interface MarkdownPreviewProps {
  markdownContent: string
}

export function MarkdownPreview({ markdownContent }: MarkdownPreviewProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const previewEditor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Markdown,
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: markdownContent,
    contentType: 'markdown',
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!previewEditor) return

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      previewEditor.commands.setContent(markdownContent, {
        contentType: 'markdown',
      })
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [markdownContent, previewEditor])

  if (!previewEditor) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-400">
        Loading preview...
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        Preview
      </div>
      <div className="prose-editor p-4">
        <EditorContent editor={previewEditor} />
      </div>
    </div>
  )
}
