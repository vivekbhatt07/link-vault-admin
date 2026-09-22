import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { CategoryTreeNode } from '@/types/api';
import CategoryTreeRow from './CategoryTreeRow';

type TCategoryTreeListProps = {
  nodes: CategoryTreeNode[];
  /** The category these `nodes` are children of, or null at the root. */
  parentId: string | null;
  depth: number;
  expandedIds: Set<string>;
  /** True while a search is active — every branch renders expanded. */
  forceExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onReorder: (parentId: string | null, orderedIds: string[]) => void;
  onEdit: (node: CategoryTreeNode) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (node: CategoryTreeNode) => void;
};

/** One sibling group per DndContext — reordering never crosses parents. */
const CategoryTreeList = ({
  nodes,
  parentId,
  depth,
  expandedIds,
  forceExpanded,
  onToggleExpand,
  onReorder,
  onEdit,
  onAddChild,
  onDelete,
}: TCategoryTreeListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = nodes.findIndex((node) => node.id === active.id);
    const newIndex = nodes.findIndex((node) => node.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(
      parentId,
      arrayMove(nodes, oldIndex, newIndex).map((node) => node.id),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={nodes.map((node) => node.id)}
        strategy={verticalListSortingStrategy}
      >
        {nodes.map((node) => {
          const isExpanded = forceExpanded || expandedIds.has(node.id);
          return (
            <div key={node.id}>
              <CategoryTreeRow
                node={node}
                depth={depth}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(node.id)}
                onEdit={() => onEdit(node)}
                onAddChild={() => onAddChild(node.id)}
                onDelete={() => onDelete(node)}
              />
              {isExpanded && node.children.length > 0 && (
                <CategoryTreeList
                  nodes={node.children}
                  parentId={node.id}
                  depth={depth + 1}
                  expandedIds={expandedIds}
                  forceExpanded={forceExpanded}
                  onToggleExpand={onToggleExpand}
                  onReorder={onReorder}
                  onEdit={onEdit}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                />
              )}
            </div>
          );
        })}
      </SortableContext>
    </DndContext>
  );
};

export default CategoryTreeList;
