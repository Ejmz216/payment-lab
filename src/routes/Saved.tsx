import { Link } from 'react-router-dom'
import { useProgressStore } from '@/store/progressStore'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getMessages, getGlossary } from '@/lib/i18nContent'
import { Card, CardTitle } from '@/components/ui/Card'

export function Saved() {
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const lang = useUIStore((s) => s.lang)
  const t = useT()

  const lessons = getLessons(lang)
  const messages = getMessages(lang)
  const glossary = getGlossary(lang)

  const savedLessons = bookmarks.filter((b) => b.startsWith('lesson:')).map((b) => lessons.find((l) => l.id === b.slice(7))).filter(Boolean)
  const savedMessages = bookmarks.filter((b) => b.startsWith('message:')).map((b) => messages.find((m) => m.id === b.slice(8))).filter(Boolean)
  const savedGlossary = bookmarks.filter((b) => b.startsWith('glossary:')).map((b) => glossary.find((g) => g.id === b.slice(9))).filter(Boolean)

  const isEmpty = savedLessons.length === 0 && savedMessages.length === 0 && savedGlossary.length === 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('saved.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('saved.description')}</p>
      </div>

      {isEmpty && (
        <Card className="flex min-h-[8rem] items-center justify-center text-center text-sm text-muted">{t('saved.empty')}</Card>
      )}

      {savedLessons.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t('saved.lessons')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {savedLessons.map((l) => l && (
              <Link key={l.id} to={`/learn/fast-payments/${l.id}`}>
                <Card className="h-full hover:border-primary/50">
                  <CardTitle>{l.title}</CardTitle>
                  <p className="text-sm text-muted">{l.subtitle}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {savedMessages.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t('saved.messages')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {savedMessages.map((m) => m && (
              <Link key={m.id} to={`/atlas/messages/${m.id}`}>
                <Card className="h-full hover:border-primary/50">
                  <CardTitle>{m.id}</CardTitle>
                  <p className="text-sm text-muted">{m.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {savedGlossary.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t('saved.glossary')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {savedGlossary.map((g) => g && (
              <Link key={g.id} to={`/glossary#${g.id}`}>
                <Card className="h-full hover:border-primary/50">
                  <CardTitle>{g.term}</CardTitle>
                  <p className="text-sm text-muted">{g.oneLine}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
