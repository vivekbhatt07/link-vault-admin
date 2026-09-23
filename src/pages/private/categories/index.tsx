import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import {
  ChevronsDownUp,
  ChevronsUpDown,
  FolderTree,
  Plus,
  Search,
} from 'lucide-react';

import Callout from '@/components/custom/Callout';
import EmptyState from '@/components/custom/EmptyState';
import ListSkeleton from '@/components/custom/ListSkeleton';
import PageHeader from '@/components/custom/PageHeader';
import CategoryDialog from '@/components/dialogs/category-dialog';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QUERY_KEYS } from '@/constants/query-key';
import { ROUTES } from '@/constants/routes';
import {
  useCategoryTree,
  useDeleteCategory,
  useReorderCategories,
} from '@/hooks/categories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { CategoryTreeNode } from '@/types/api';

import {
  applyReorderToTree,
  collectParentIds,
  countNodes,
  filterTree,
} from './helpers';
import CategoryTreeList from './layouts/CategoryTreeList';

type TDialogState =
  | { type: 'closed' }
  | { type: 'create'; parentId: string | null }
  | { type: 'edit'; category: CategoryTreeNode }
  | { type: 'delete'; category: CategoryTreeNode };

const TREE_PARAMS = { includeInactive: true };

/** `?new=1` (from the dashboard or command palette) opens the create dialog. */
const NEW_PARAM = 'new';

const CategoriesPage = () => {
  useDocumentTitle('Categories');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryTree = useCategoryTree(TREE_PARAMS);
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<TDialogState>({ type: 'closed' });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const wantsNew = searchParams.get(NEW_PARAM) === '1';
  if (wantsNew && dialog.type === 'closed') {
    setDialog({ type: 'create', parentId: null });
  }
  useEffect(() => {
    if (!wantsNew) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(NEW_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [wantsNew, setSearchParams]);

  const treeData = categoryTree.data;
  const tree = treeData ?? [];
  const query = search.trim().toLowerCase();
  const visibleTree = useMemo(() => {
    const current = treeData ?? [];
    return query ? filterTree(current, query) : current;
  }, [treeData, query]);

  const closeDialog = () => {
    setDialog({ type: 'closed' });
    setDeleteError(null);
  };

  const parentIds = useMemo(() => collectParentIds(treeData ?? []), [treeData]);
  const isAllExpanded =
    parentIds.length > 0 && parentIds.every((id) => expandedIds.has(id));
  const toggleExpandAll = () =>
    setExpandedIds(isAllExpanded ? new Set() : new Set(parentIds));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReorder = (parentId: string | null, orderedIds: string[]) => {
    // Optimistic: the drop already shows the new order without waiting on
    // the round trip; the mutation reconciles (and rolls back on error via
    // the invalidation in useReorderCategories).
    queryClient.setQueryData<CategoryTreeNode[]>(
      QUERY_KEYS.CATEGORIES.TREE(TREE_PARAMS),
      (old) => (old ? applyReorderToTree(old, parentId, orderedIds) : old),
    );
    reorderCategories.mutate({
      items: orderedIds.map((id, index) => ({ id, sortOrder: index })),
    });
  };

  const handleDelete = () => {
    if (dialog.type !== 'delete') return;
    setDeleteError(null);
    deleteCategory.mutate(dialog.category.id, {
      onSuccess: closeDialog,
      // 409 message is shown verbatim inside the dialog.
      onError: (error) => setDeleteError(error.message),
    });
  };

  const deletingCategory = dialog.type === 'delete' ? dialog.category : null;
  const deleteErrorIsProducts = deleteError?.toLowerCase().includes('product');

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Categories"
        count={tree.length > 0 ? countNodes(tree) : undefined}
        description="Group products on the storefront. Drag to reorder siblings; nest to any depth."
        actions={
          <Button onClick={() => setDialog({ type: 'create', parentId: null })}>
            <Plus />
            New category
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            type="search"
            placeholder="Search by name or slug…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClear={() => setSearch('')}
            startAdornment={
              <Search className="pointer-events-none size-4 text-stone-400" />
            }
          />
        </div>
        {parentIds.length > 0 && !query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpandAll}
            className="w-fit text-stone-500"
            startAdornment={
              isAllExpanded ? <ChevronsDownUp /> : <ChevronsUpDown />
            }
          >
            {isAllExpanded ? 'Collapse all' : 'Expand all'}
          </Button>
        )}
      </div>

      {categoryTree.isPending ? (
        <ListSkeleton rows={6} trailing={1} bordered />
      ) : visibleTree.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700/60 dark:bg-stone-900">
          <CategoryTreeList
            nodes={visibleTree}
            parentId={null}
            depth={0}
            expandedIds={expandedIds}
            forceExpanded={Boolean(query)}
            onToggleExpand={toggleExpand}
            onReorder={handleReorder}
            onEdit={(category) => setDialog({ type: 'edit', category })}
            onAddChild={(parentId) => setDialog({ type: 'create', parentId })}
            onDelete={(category) => setDialog({ type: 'delete', category })}
          />
        </div>
      ) : (
        <EmptyState
          icon={<FolderTree className="size-5" />}
          title={query ? 'No categories match' : 'No categories yet'}
          description={
            query
              ? 'Try a different name or slug.'
              : 'Create a category to start organising products.'
          }
        />
      )}

      <CategoryDialog
        open={dialog.type === 'create' || dialog.type === 'edit'}
        onOpenChange={(open) => !open && closeDialog()}
        category={dialog.type === 'edit' ? dialog.category : null}
        defaultParentId={dialog.type === 'create' ? dialog.parentId : null}
      />

      <ConfirmDialog
        open={dialog.type === 'delete'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete category"
        variant="destructive"
        confirmLabel="Delete category"
        isPending={deleteCategory.isPending}
        onConfirm={handleDelete}
        description={
          <p>
            This permanently deletes{' '}
            <span className="font-medium text-stone-900 dark:text-stone-50">
              {deletingCategory?.name}
            </span>
            . Categories with subcategories or products (including inactive
            ones) cannot be deleted — clear those first.
          </p>
        }
      >
        {deleteError && deletingCategory && (
          <Callout variant="danger" role="alert" title={deleteError}>
            {deleteErrorIsProducts && (
              <div className="mt-1 flex flex-col gap-1.5">
                <Link
                  to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?categoryId=${deletingCategory.id}`}
                  className="w-fit font-medium underline underline-offset-2 hover:text-red-900 dark:hover:text-red-200"
                >
                  View products in {deletingCategory.name} →
                </Link>
                <p>
                  This includes inactive products, which aren't shown on the
                  storefront but still block deletion.
                </p>
              </div>
            )}
          </Callout>
        )}
      </ConfirmDialog>
    </div>
  );
};

export default CategoriesPage;
