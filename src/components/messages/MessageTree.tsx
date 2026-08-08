import { useState } from 'react'
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import type { MessageFieldNode } from '@/types/content'

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: MessageFieldNode
  depth: number
  selectedId: string | null
  onSelect: (n: MessageFieldNode) => void
}) {
  const [open, setOpen] = useState(depth < 2)
  const hasChildren = !!node.children?.length

  return (
    <div>
      <div
        className={clsx(
          'flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 text-sm hover:bg-surface2',
          selectedId === node.id && 'bg-primary/15 text-primary',
        )}
        style={{ paddingLeft: depth * 14 + 4 }}
        onClick={() => {
          onSelect(node)
          if (hasChildren) setOpen(!open)
        }}
      >
        {hasChildren ? (
          <ChevronRight size={13} className={clsx('shrink-0 transition-transform', open && 'rotate-90')} />
        ) : (
          <span className="inline-block w-[13px]" />
        )}
        <span className="font-mono text-xs">{node.xmlTag}</span>
        <span className="ml-1.5 truncate text-xs text-muted">{node.cardinality}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MessageTree({ root, onSelect, selectedId }: { root: MessageFieldNode; onSelect: (n: MessageFieldNode) => void; selectedId: string | null }) {
  return (
    <div className="max-h-[32rem] overflow-y-auto rounded-md border border-border bg-surface p-2">
      <TreeNode node={root} depth={0} selectedId={selectedId} onSelect={onSelect} />
    </div>
  )
}
