import { Bookmark } from 'lucide-react'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'

// `id` is a prefixed key like "lesson:payment-fundamentals" so the Saved
// page can resolve which content type a bookmark refers to.
export function BookmarkButton({ id, size = 15 }: { id: string; size?: number }) {
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark)
  const t = useT()
  const saved = bookmarks.includes(id)

  return (
    <button
      onClick={() => toggleBookmark(id)}
      title={saved ? t('bookmark.saved') : t('bookmark.save')}
      aria-pressed={saved}
      className={clsx(
        'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
        saved ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
      )}
    >
      <Bookmark size={size} fill={saved ? 'currentColor' : 'none'} />
      {saved ? t('bookmark.saved') : t('bookmark.save')}
    </button>
  )
}
