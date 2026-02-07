interface MarkdownSourceEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownSourceEditor({
  value,
  onChange,
}: MarkdownSourceEditorProps) {
  return (
    <div className="h-full">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        Markdown Source
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[calc(100%-2rem)] w-full resize-none bg-gray-900 p-4 font-mono text-sm text-green-400 focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}
