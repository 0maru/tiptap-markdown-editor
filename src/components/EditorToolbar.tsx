import { useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { ExportButton } from './ExportButton'

type EditorMode = 'wysiwyg' | 'source'

interface EditorToolbarProps {
  editor: Editor | null
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  markdownContent: string
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />
}

export function EditorToolbar({
  editor,
  mode,
  onModeChange,
  markdownContent,
}: EditorToolbarProps) {
  const isWysiwyg = mode === 'wysiwyg'

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Link URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const addTable = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={isWysiwyg && !!editor?.isActive('bold')}
        disabled={!isWysiwyg}
        title="Bold"
      >
        B
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={isWysiwyg && !!editor?.isActive('italic')}
        disabled={!isWysiwyg}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={isWysiwyg && !!editor?.isActive('strike')}
        disabled={!isWysiwyg}
        title="Strikethrough"
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCode().run()}
        isActive={isWysiwyg && !!editor?.isActive('code')}
        disabled={!isWysiwyg}
        title="Inline Code"
      >
        {'</>'}
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={isWysiwyg && !!editor?.isActive('heading', { level: 1 })}
        disabled={!isWysiwyg}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={isWysiwyg && !!editor?.isActive('heading', { level: 2 })}
        disabled={!isWysiwyg}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={isWysiwyg && !!editor?.isActive('heading', { level: 3 })}
        disabled={!isWysiwyg}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={isWysiwyg && !!editor?.isActive('bulletList')}
        disabled={!isWysiwyg}
        title="Bullet List"
      >
        &#8226; List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={isWysiwyg && !!editor?.isActive('orderedList')}
        disabled={!isWysiwyg}
        title="Ordered List"
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        isActive={isWysiwyg && !!editor?.isActive('taskList')}
        disabled={!isWysiwyg}
        title="Task List"
      >
        &#9744; Task
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={isWysiwyg && !!editor?.isActive('blockquote')}
        disabled={!isWysiwyg}
        title="Blockquote"
      >
        &#8220; Quote
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        isActive={isWysiwyg && !!editor?.isActive('codeBlock')}
        disabled={!isWysiwyg}
        title="Code Block"
      >
        {'{ }'}
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        disabled={!isWysiwyg}
        title="Horizontal Rule"
      >
        &#8213;
      </ToolbarButton>

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarButton onClick={addLink} disabled={!isWysiwyg} title="Add Link">
        Link
      </ToolbarButton>
      <ToolbarButton
        onClick={addImage}
        disabled={!isWysiwyg}
        title="Add Image"
      >
        Image
      </ToolbarButton>
      <ToolbarButton
        onClick={addTable}
        disabled={!isWysiwyg}
        title="Insert Table"
      >
        Table
      </ToolbarButton>

      <ToolbarDivider />

      {/* Mode toggle */}
      <div className="flex rounded border border-gray-200">
        <button
          type="button"
          onClick={() => onModeChange('wysiwyg')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'wysiwyg'
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          WYSIWYG
        </button>
        <button
          type="button"
          onClick={() => onModeChange('source')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'source'
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Source
        </button>
      </div>

      <div className="ml-auto">
        <ExportButton markdownContent={markdownContent} />
      </div>
    </div>
  )
}
