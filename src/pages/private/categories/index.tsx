import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { FolderTree, Plus, Search } from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import PageHeader from '@/components/custom/PageHeader';
import CategoryDialog from '@/components/dialogs/category-dialog';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { QUERY_KEYS } from '@/constants/query-key';
import { ROUTES } from '@/constants/routes';
import {
  useCategoryTree,
  useDeleteCategory,
  useReorderCategories,
} from '@/hooks/categories';
import type { CategoryTreeNode } from '@/types/api';

import { applyReorderToTree, countNodes, filterTree } from './helpers';
import CategoryTreeList from './layouts/CategoryTreeList';

type TDialogState =
  | { type: 'closed' }
  | { type: 'create'; parentId: string | null }
  | { type: 'edit'; category: CategoryTreeNode }
  | { type: 'delete'; category: CategoryTreeNode };

const TREE_PARAMS = { includeInactive: true };

const CategoriesPage = () => {
  const categoryTree = useCategoryTree(TREE_PARAMS);
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<TDialogState>({ type: 'closed' });
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

      <div className="max-w-sm">
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

      {categoryTree.isPending ? (
        <Loader centered className="my-16" />
      ) : visibleTree.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900">
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
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            <p className="font-medium">{deleteError}</p>
            {deleteErrorIsProducts && (
              <>
                <Link
                  to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?categoryId=${deletingCategory.id}`}
                  className="underline underline-offset-2 hover:text-red-900 dark:hover:text-red-200"
                >
                  View products in {deletingCategory.name} →
                </Link>
                <p className="text-red-600/80 dark:text-red-300/80">
                  This includes inactive products, which aren't shown on the
                  storefront but still block deletion.
                </p>
              </>
            )}
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
};

export default CategoriesPage;
