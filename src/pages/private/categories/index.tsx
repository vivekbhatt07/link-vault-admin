import { useState } from 'react';
import { Link } from 'react-router';
import { FolderTree, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import ImageThumb from '@/components/custom/ImageThumb';
import PageHeader from '@/components/custom/PageHeader';
import CategoryDialog from '@/components/dialogs/category-dialog';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/helpers/format';
import { useCategories, useDeleteCategory } from '@/hooks/categories';
import type { Category } from '@/types/api';

type TDialogState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; category: Category }
  | { type: 'delete'; category: Category };

const CategoriesPage = () => {
  const categories = useCategories();
  const deleteCategory = useDeleteCategory();
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<TDialogState>({ type: 'closed' });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const items = categories.data ?? [];
  const query = search.trim().toLowerCase();
  const filtered = query
    ? items.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.slug.includes(query),
      )
    : items;

  const closeDialog = () => {
    setDialog({ type: 'closed' });
    setDeleteError(null);
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

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Categories"
        count={categories.data?.length}
        description="Group products on the storefront. Slugs are generated from names."
        actions={
          <Button onClick={() => setDialog({ type: 'create' })}>
            <Plus />
            New category
          </Button>
        }
      />

      <div className="max-w-sm">
        <Input
          type="search"
          placeholder="Filter by name or slug…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch('')}
          startAdornment={
            <Search className="pointer-events-none size-4 text-stone-400" />
          }
        />
      </div>

      {categories.isPending ? (
        <Loader centered className="my-16" />
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900">
          <Table>
            <TableHeader className="bg-stone-50 dark:bg-stone-800/50">
              <TableRow>
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden w-36 sm:table-cell">
                  Updated
                </TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <ImageThumb
                        src={category.image}
                        alt={category.name}
                        className="size-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm leading-snug font-medium text-stone-900 dark:text-stone-50">
                          {category.name}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-xs text-stone-400 dark:text-stone-500">
                          {category.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="line-clamp-2 max-w-md text-xs text-stone-500 dark:text-stone-400">
                      {category.description || (
                        <span className="text-stone-400 dark:text-stone-500">
                          —
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="hidden text-xs whitespace-nowrap text-stone-500 sm:table-cell dark:text-stone-400">
                    {formatDate(category.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDialog({ type: 'edit', category })}
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil className="text-stone-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDialog({ type: 'delete', category })}
                        aria-label={`Delete ${category.name}`}
                        className="text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            . Categories with products (including inactive ones) cannot be
            deleted — move or delete those products first.
          </p>
        }
      >
        {deleteError && deletingCategory && (
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            <p className="font-medium">{deleteError}</p>
            <Link
              to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?categoryId=${deletingCategory.id}`}
              className="underline underline-offset-2 hover:text-red-900 dark:hover:text-red-200"
            >
              View active products in {deletingCategory.name} →
            </Link>
            <p className="text-red-600/80 dark:text-red-300/80">
              Inactive products in this category also block deletion but cannot
              be listed from this panel.
            </p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
};

export default CategoriesPage;
