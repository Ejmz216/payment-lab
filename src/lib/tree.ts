import type { MessageFieldNode } from '@/types/content'

export function findParent(root: MessageFieldNode, targetId: string): MessageFieldNode | null {
  if (!root.children) return null
  for (const child of root.children) {
    if (child.id === targetId) return root
    const found = findParent(child, targetId)
    if (found) return found
  }
  return null
}
