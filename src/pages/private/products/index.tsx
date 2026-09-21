import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Package, Plus } from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import PageHeader from '@/components/custom/PageHeader';
import TablePagination from '@/components/custom/TablePagination';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ROUTES } from '@/constants/routes';
import { useCategories } from '@/hooks/categories';
import {
  useDeleteProduct,
  useProducts,
  useToggleProductFeatured,
  useUpdateProduct,
} from '@/hooks/products';
import type { Product } from '@/types/api';

import {
  DEACTIVATE_WARNING,
  PRODUCT_DELETE_CONFIRMATION,
  PRODUCT_LIST_LIMIT,
  PRODUCT_LIST_SEARCH_PARAMS,
} from './constants';
import ProductFilters from './layouts/ProductFilters';
import ProductsTable from './layouts/ProductsTable';

type TDialogState =
  | { type: 'closed' }
  | { type: 'deactivate'; product: Product }
  | { type: 'delete'; product: Product };

const { PAGE, CATEGORY_ID, IS_FEATURED } = PRODUCT_LIST_SEARCH_PARAMS;

const parseFeatured = (value: string | null) =>
  value === 'true' ? true : value === 'false' ? false : undefined;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<TDialogState>({ type: 'closed' });

  // Server-side filters live in the URL so category 409 links can deep-link.
  const page = Math.max(1, Number(searchParams.get(PAGE)) || 1);
  const categoryId = searchParams.get(CATEGORY_ID) ?? undefined;
  const isFeatured = parseFeatured(searchParams.get(IS_FEATURED));

  const categories = useCategories();
  const products = useProducts({
    page,
    limit: PRODUCT_LIST_LIMIT,
    categoryId,
    isFeatured,
  });
  const toggleFeatured = useToggleProductFeatured();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const setFilter = (key: string, value: string | undefined) =>
    // Any filter change resets to the first page.
    updateParams({ [key]: value, [PAGE]: undefined });

  const items = products.data?.items ?? [];
  const query = search.trim().toLowerCase();
  const visible = query
    ? items.filter((product) => product.name.toLowerCase().includes(query))
    : items;

  const closeDialog = () => setDialog({ type: 'closed' });
  const isMutating = updateProduct.isPending || deleteProduct.isPending;

  const handleDeactivate = () => {
    if (dialog.type !== 'deactivate') return;
    updateProduct.mutate(
      { id: dialog.product.id, payload: { isActive: false } },
      { onSuccess: closeDialog },
    );
  };

  const handleDelete = () => {
    if (dialog.type !== 'delete') return;
    deleteProduct.mutate(dialog.product.id, { onSuccess: closeDialog });
  };

  const dialogProduct = dialog.type === 'closed' ? null : dialog.product;

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Products"
        count={products.data?.total}
        description="Only active products are listed. Deactivated products are hidden everywhere."
        actions={
          <Button asChild>
            <Link to={ROUTES.PRIVATE.PRODUCTS.CREATE}>
              <Plus />
              New product
            </Link>
          </Button>
        }
      />

      <ProductFilters
        categories={categories.data ?? []}
        categoryId={categoryId}
        isFeatured={isFeatured}
        search={search}
        onCategoryChange={(value) => setFilter(CATEGORY_ID, value)}
        onFeaturedChange={(value) =>
          setFilter(
            IS_FEATURED,
            value === undefined ? undefined : String(value),
          )
        }
        onSearchChange={setSearch}
        onClear={() => {
          setSearch('');
          setSearchParams(new URLSearchParams());
        }}
      />

      {products.isPending ? (
        <Loader centered className="my-16" />
      ) : visible.length > 0 ? (
        <>
          <ProductsTable
            products={visible}
            isBusy={isMutating}
            onToggleFeatured={(product, value) =>
              toggleFeatured.mutate({ id: product.id, isFeatured: value })
            }
            onDeactivate={(product) =>
              setDialog({ type: 'deactivate', product })
            }
            onDelete={(product) => setDialog({ type: 'delete', product })}
          />
          {query && visible.length !== items.length && (
            <p className="-mt-3 text-xs text-stone-400 dark:text-stone-500">
              Showing {visible.length} of {items.length} on this page. The name
              filter only applies to the current page.
            </p>
          )}
          <TablePagination
            page={products.data?.page ?? page}
            limit={products.data?.limit ?? PRODUCT_LIST_LIMIT}
            total={products.data?.total ?? 0}
            hasMore={products.data?.hasMore ?? false}
            isFetching={products.isFetching}
            onPageChange={(next) =>
              updateParams({ [PAGE]: next > 1 ? String(next) : undefined })
            }
          />
        </>
      ) : (
        <EmptyState
          icon={<Package className="size-5" />}
          title={
            query || categoryId || isFeatured !== undefined
              ? 'No products match'
              : 'No products yet'
          }
          description={
            query
              ? 'The name filter only searches the current page. Try clearing it.'
              : categoryId || isFeatured !== undefined
                ? 'Try a different category or featured filter.'
                : 'Create your first product to get started.'
          }
          action={
            !query && !categoryId && isFeatured === undefined ? (
              <Button size="sm" asChild>
                <Link to={ROUTES.PRIVATE.PRODUCTS.CREATE}>
                  <Plus />
                  New product
                </Link>
              </Button>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={dialog.type === 'deactivate'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Deactivate this product?"
        variant="destructive"
        confirmLabel="Deactivate"
        isPending={updateProduct.isPending}
        onConfirm={handleDeactivate}
        description={
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium text-stone-900 dark:text-stone-50">
                {dialogProduct?.name}
              </span>{' '}
              will disappear from the storefront and from this panel.
            </p>
            <p className="font-medium text-red-600 dark:text-red-400">
              {DEACTIVATE_WARNING}
            </p>
            <p>An Undo action is offered briefly after deactivating.</p>
          </div>
        }
      />

      <ConfirmDialog
        open={dialog.type === 'delete'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete product"
        variant="destructive"
        confirmLabel="Delete permanently"
        confirmText={PRODUCT_DELETE_CONFIRMATION}
        isPending={deleteProduct.isPending}
        onConfirm={handleDelete}
        description={
          <p>
            This permanently deletes{' '}
            <span className="font-medium text-stone-900 dark:text-stone-50">
              {dialogProduct?.name}
            </span>{' '}
            and all of its testimonials. This cannot be undone.
          </p>
        }
      />
    </div>
  );
};

export default ProductsPage;
