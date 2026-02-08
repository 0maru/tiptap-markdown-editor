import { useEffect, useRef, useState } from 'react'
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

type PreviewMode = 'preview' | 'html'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface HastNode {
  type: string
  value?: string
  properties?: { className?: string[] }
  children?: HastNode[]
}

function hastToHtml(node: HastNode): string {
  if (node.type === 'text') return escapeHtml(node.value ?? '')
  if (node.type === 'element') {
    const cls = node.properties?.className?.join(' ') || ''
    const children = (node.children ?? []).map(hastToHtml).join('')
    return cls ? `<span class="${cls}">${children}</span>` : children
  }
  if (node.children) return node.children.map(hastToHtml).join('')
  return ''
}

function formatHtml(html: string): string {
  const blockTags =
    /(<\/?(?:div|p|h[1-6]|ul|ol|li|blockquote|pre|table|thead|tbody|tr|th|td|hr|br|section|article|header|footer|nav|figure|figcaption)[^>]*>)/gi
  const parts = html
    .replace(blockTags, '\n$1\n')
    .split('\n')
    .filter(Boolean)
  let indent = 0
  const result: string[] = []
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    if (/^<\//.test(trimmed)) indent = Math.max(0, indent - 1)
    result.push('  '.repeat(indent) + trimmed)
    if (
      /^<[^/!][^>]*[^/]>$/.test(trimmed) &&
      !/^<(?:br|hr|img|input|meta|link)[\s>]/i.test(trimmed)
    ) {
      indent++
    }
  }
  return result.join('\n')
}

interface MarkdownPreviewProps {
  markdownContent: string
}

export function MarkdownPreview({ markdownContent }: MarkdownPreviewProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview')
  const [highlightedHtml, setHighlightedHtml] = useState('')

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
      if (previewMode === 'html') {
        const rawHtml = previewEditor.getHTML()
        const formatted = formatHtml(rawHtml)
        const tree = lowlight.highlight('xml', formatted)
        setHighlightedHtml(hastToHtml(tree as unknown as HastNode))
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [markdownContent, previewEditor, previewMode])

  useEffect(() => {
    if (!previewEditor || previewMode !== 'html') return
    const rawHtml = previewEditor.getHTML()
    const formatted = formatHtml(rawHtml)
    const tree = lowlight.highlight('xml', formatted)
    setHighlightedHtml(hastToHtml(tree as unknown as HastNode))
  }, [previewMode, previewEditor])

  if (!previewEditor) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-400">
        Loading preview...
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex rounded border border-gray-200">
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              previewMode === 'preview'
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('html')}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              previewMode === 'html'
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            HTML
          </button>
        </div>
      </div>
      {previewMode === 'preview' ? (
        <div className="prose-editor p-4">
          <EditorContent editor={previewEditor} />
        </div>
      ) : (
        <pre className="html-source h-full overflow-auto bg-gray-900 p-4 font-mono text-sm">
          <code
            className="text-gray-300"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      )}
    </div>
  )
}
