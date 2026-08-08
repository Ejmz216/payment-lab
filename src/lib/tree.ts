import type { MessageFieldNode } from '@/types/content'

export function flattenByXmlTag(root: MessageFieldNode, map: Map<string, MessageFieldNode> = new Map()): Map<string, MessageFieldNode> {
  if (!map.has(root.xmlTag)) map.set(root.xmlTag, root)
  root.children?.forEach((c) => flattenByXmlTag(c, map))
  return map
}

export function findById(root: MessageFieldNode, id: string): MessageFieldNode | null {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const found = findById(child, id)
    if (found) return found
  }
  return null
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

/** Full ancestor chain from root to the target node (inclusive), or null if not found. */
export function findPath(root: MessageFieldNode, targetId: string): MessageFieldNode[] | null {
  if (root.id === targetId) return [root]
  for (const child of root.children ?? []) {
    const sub = findPath(child, targetId)
    if (sub) return [root, ...sub]
  }
  return null
}

export interface XmlSyncMaps {
  lineToNode: Map<number, MessageFieldNode>
  nodeIdToLine: Map<string, number>
}

// Walks the XML text structurally in lockstep with the message tree (rather
// than matching bare tag names) so that fields with repeated tag names at
// different depths resolve to the correct node, and builds a two-way
// line <-> node map for the XML Lab's synchronized tree/editor view.
export function buildXmlSyncMaps(xml: string, root: MessageFieldNode): XmlSyncMaps {
  const lines = xml.split('\n')
  const lineToNode = new Map<number, MessageFieldNode>()
  const nodeIdToLine = new Map<string, number>()
  const stack: (MessageFieldNode | null)[] = []
  const tagRe = /<(\/?)([A-Za-z][\w:]*)[^>]*?(\/?)>/g

  lines.forEach((lineText, idx) => {
    const lineNumber = idx + 1
    tagRe.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = tagRe.exec(lineText))) {
      const isClose = m[1] === '/'
      const tagName = m[2]
      const selfClose = m[3] === '/'

      if (isClose) {
        stack.pop()
        continue
      }

      const parent = stack.length === 0 ? null : stack[stack.length - 1]
      let node: MessageFieldNode | null = null
      if (stack.length === 0 && tagName === root.xmlTag) {
        node = root
      } else if (parent) {
        node = parent.children?.find((c) => c.xmlTag === tagName) ?? null
      }

      if (node) {
        lineToNode.set(lineNumber, node)
        if (!nodeIdToLine.has(node.id)) nodeIdToLine.set(node.id, lineNumber)
      }

      if (!selfClose) stack.push(node)
    }
  })

  return { lineToNode, nodeIdToLine }
}
