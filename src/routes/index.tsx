import { createFileRoute } from '@tanstack/react-router'
import { MarkdownEditor } from '~/components/MarkdownEditor'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <MarkdownEditor />
    </div>
  )
}
