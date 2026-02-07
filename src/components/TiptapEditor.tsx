import { EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'

interface TiptapEditorProps {
  editor: Editor | null
}

export function TiptapEditor({ editor }: TiptapEditorProps) {
  if (!editor) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-400">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="prose-editor h-full overflow-y-auto p-4">
      <EditorContent editor={editor} />
    </div>
  )
}
