import type { MessageFieldNode } from '@/types/content'

export function flattenByXmlTag(root: MessageFieldNode, map: Map<string, MessageFieldNode> = new Map()): Map<string, MessageFieldNode> {
  if (!map.has(root.xmlTag)) map.set(root.xmlTag, root)
  root.children?.forEach((c) => flattenByXmlTag(c, map))
  return map
}

export function findParent(root: MessageFieldNode, targetId: string): MessageFieldNode | null {
  if (!root.children) return null
  for (const child of root.children) {
    if (child.id === targetId) return root
    const found = findParent(child, targetId)
    if (found) return found
  }
  return null
}
