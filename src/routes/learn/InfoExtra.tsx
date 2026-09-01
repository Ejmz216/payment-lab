import { FileQuestion, ShieldQuestion } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import infoExtra from '@/content/infoExtra.md?raw'

export function InfoExtra() {
  return (
    <div className="flex flex-col gap-6">
      <section className="technical-surface border-y border-warning/35 bg-warning/5 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                TO VERIFY
              </span>
              <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                IMPLEMENTATION QUESTION
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold">Info extra</h1>
          </div>
          <ShieldQuestion className="text-warning" size={32} aria-hidden="true" />
        </div>
      </section>

      <article className="mx-auto w-full max-w-4xl pb-10">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <div className="mb-8 border-b border-border pb-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-warning/35 bg-warning/10 text-warning">
                  <FileQuestion size={19} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{children}</h2>
              </div>
            ),
            h3: ({ children }) => (
              <h3 className="mt-9 border-l-4 border-scheme pl-3 text-lg font-semibold leading-snug text-text first:mt-0">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="mt-4 text-[15px] leading-7 text-text/90">{children}</p>,
            ol: ({ children }) => <ol className="mt-5 list-decimal space-y-4 pl-6 text-[15px] leading-7 text-text/90">{children}</ol>,
            li: ({ children }) => <li className="pl-1 marker:font-semibold marker:text-warning">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-warning">{children}</strong>,
            blockquote: ({ children }) => (
              <blockquote className="mt-5 border-l-4 border-primary bg-primary/5 px-4 py-1 text-text">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-8 border-border" />,
          }}
        >
          {infoExtra}
        </ReactMarkdown>
      </article>
    </div>
  )
}
