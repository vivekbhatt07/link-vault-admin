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
import { SimpleTooltip } from '@/components/ui/tooltip';
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

const INDENT_PX = 24;

const CategoryTreeRow = ({
  node,
  depth,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddChild,
  onDelete,
}: TCategoryTreeRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });
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
        'group flex items-center gap-2 border-b border-stone-100 bg-white py-2 pr-3 transition-colors last:border-b-0 dark:border-stone-800 dark:bg-stone-900',
        'hover:bg-stone-50/80 dark:hover:bg-stone-800/30',
        isDragging &&
          'relative z-10 rounded-lg border-transparent shadow-xl ring-2 ring-accent-500/40 dark:bg-stone-800',
      )}
    >
      <div
        style={{ paddingLeft: `${8 + depth * INDENT_PX}px` }}
        className="relative flex min-w-0 flex-1 items-center gap-2"
      >
        {/* Indent guides — one faint rail per ancestor level */}
        {Array.from({ length: depth }).map((_, level) => (
          <span
            key={level}
            aria-hidden
            className="absolute -inset-y-2 w-px bg-stone-100 dark:bg-stone-800"
            style={{ left: `${19 + level * INDENT_PX}px` }}
          />
        ))}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded p-0.5 text-stone-300 transition-colors group-hover:text-stone-400 hover:bg-stone-100 hover:text-stone-600 active:cursor-grabbing dark:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
          aria-label={`Reorder ${node.name}`}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          disabled={!hasChildren}
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-md text-stone-400 transition-colors',
            hasChildren &&
              'cursor-pointer hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200',
          )}
          aria-label={
            isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`
          }
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                'size-4 transition-transform duration-200',
                isExpanded && 'rotate-90',
              )}
            />
          )}
        </button>

        <ImageThumb
          src={node.image}
          alt={node.name}
          className={cn(
            'size-9 transition-opacity',
            !node.isActive && 'opacity-50',
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="cursor-pointer truncate text-left text-sm font-medium text-stone-900 transition-colors hover:text-accent-600 dark:text-stone-50 dark:hover:text-accent-400"
            >
              {node.name}
            </button>
            {!node.isActive && <Badge variant="secondary">Inactive</Badge>}
            {hasChildren && (
              <span className="rounded-full bg-stone-100 px-1.5 text-[10px] font-medium tabular-nums text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                {node.children.length} sub
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-stone-400 dark:text-stone-500">
            {node.slug} · {node.productCount} product
            {node.productCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <SimpleTooltip
          label={
            node.isActive ? 'Active on storefront' : 'Hidden from storefront'
          }
        >
          <span className="mr-1.5 inline-flex">
            <Switch
              checked={node.isActive}
              onCheckedChange={(checked) =>
                updateCategory.mutate({
                  id: node.id,
                  payload: { isActive: checked },
                })
              }
              disabled={updateCategory.isPending}
              aria-label={
                node.isActive
                  ? `Deactivate ${node.name}`
                  : `Activate ${node.name}`
              }
            />
          </span>
        </SimpleTooltip>
        <SimpleTooltip label="Add subcategory">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onAddChild}
            aria-label={`Add subcategory under ${node.name}`}
          >
            <FolderPlus className="text-stone-400" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip label="Edit">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label={`Edit ${node.name}`}
          >
            <Pencil className="text-stone-400" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip label="Delete">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label={`Delete ${node.name}`}
            className="text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
          >
            <Trash2 />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
};

export default CategoryTreeRow;
