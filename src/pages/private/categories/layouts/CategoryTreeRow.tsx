import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronRight,
  FolderPlus,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react';

import ImageThumb from '@/components/custom/ImageThumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUpdateCategory } from '@/hooks/categories';
import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from '@/types/api';

type TCategoryTreeRowProps = {
  node: CategoryTreeNode;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onAddChild: () => void;
  onDelete: () => void;
};

const CategoryTreeRow = ({
  node,
  depth,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddChild,
  onDelete,
}: TCategoryTreeRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: node.id });
  const updateCategory = useUpdateCategory();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = node.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 border-b border-stone-100 bg-white py-2 pr-3 last:border-b-0 dark:border-stone-800 dark:bg-stone-900',
        isDragging && 'relative z-10 opacity-70 shadow-md',
      )}
    >
      <div
        style={{ paddingLeft: `${depth * 20}px` }}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex shrink-0 cursor-grab touch-none items-center justify-center text-stone-300 hover:text-stone-500 active:cursor-grabbing dark:text-stone-600"
          aria-label={`Reorder ${node.name}`}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          disabled={!hasChildren}
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded text-stone-400',
            hasChildren && 'hover:bg-stone-100 dark:hover:bg-stone-800',
          )}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                'size-4 transition-transform',
                isExpanded && 'rotate-90',
              )}
            />
          )}
        </button>

        <ImageThumb src={node.image} alt={node.name} className="size-9" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-50">
              {node.name}
            </p>
            <Badge variant={node.isActive ? 'default' : 'secondary'}>
              {node.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-stone-400 dark:text-stone-500">
            {node.slug} · {node.productCount} product
            {node.productCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Switch
          checked={node.isActive}
          onCheckedChange={(checked) =>
            updateCategory.mutate({
              id: node.id,
              payload: { isActive: checked },
            })
          }
          aria-label={node.isActive ? `Deactivate ${node.name}` : `Activate ${node.name}`}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onAddChild}
          aria-label={`Add subcategory under ${node.name}`}
        >
          <FolderPlus className="text-stone-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onEdit}
          aria-label={`Edit ${node.name}`}
        >
          <Pencil className="text-stone-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label={`Delete ${node.name}`}
          className="text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default CategoryTreeRow;
