import type { CategoryTreeNode } from '@/types/api';

/** Keeps a node if it matches, or if any descendant matches (with only the
 * matching branches kept); a self-match keeps the whole original subtree. */
export const filterTree = (
  nodes: CategoryTreeNode[],
  query: string,
): CategoryTreeNode[] =>
  nodes.reduce<CategoryTreeNode[]>((acc, node) => {
    const matchesSelf =
      node.name.toLowerCase().includes(query) || node.slug.includes(query);
    const filteredChildren = filterTree(node.children, query);
    if (matchesSelf || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: matchesSelf ? node.children : filteredChildren,
      });
    }
    return acc;
  }, []);

export const countNodes = (nodes: CategoryTreeNode[]): number =>
  nodes.reduce((count, node) => count + 1 + countNodes(node.children), 0);

/** Replaces the sibling order under `parentId` (or the roots, when null)
 * with `orderedIds`, leaving every other branch untouched. */
export const applyReorderToTree = (
  tree: CategoryTreeNode[],
  parentId: string | null,
  orderedIds: string[],
): CategoryTreeNode[] => {
  const sortByIds = (nodes: CategoryTreeNode[]) =>
    [...nodes].sort(
      (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id),
    );

  if (parentId === null) return sortByIds(tree);

  const walk = (nodes: CategoryTreeNode[]): CategoryTreeNode[] =>
    nodes.map((node) =>
      node.id === parentId
        ? { ...node, children: sortByIds(node.children) }
        : { ...node, children: walk(node.children) },
    );

  return walk(tree);
};
