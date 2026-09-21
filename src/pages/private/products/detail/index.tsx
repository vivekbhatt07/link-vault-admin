import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Boxes,
  FolderTree,
  PackageX,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { ROUTES } from '@/constants/routes';
import { formatDateTime, formatPrice } from '@/helpers/format';
import { useDeleteProduct, useProduct } from '@/hooks/products';

import { PRODUCT_DELETE_CONFIRMATION } from '../constants';
import ProductGallery from './layouts/ProductGallery';
import ProductTestimonials from './layouts/ProductTestimonials';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = useProduct(slug);
  const deleteProduct = useDeleteProduct();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (product.isPending) {
    return <Loader centered className="my-24" />;
  }

  if (product.isError || !product.data) {
    return (
      <EmptyState
        icon={<PackageX className="size-5" />}
        title="Product not found"
        description="It may have been deleted or deactivated. Inactive products cannot be viewed from this panel."
        className="w-full"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.PRIVATE.PRODUCTS.ROOT}>Back to products</Link>
          </Button>
        }
      />
    );
  }

  const item = product.data;

  const handleDelete = () => {
    deleteProduct.mutate(item.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        navigate(ROUTES.PRIVATE.PRODUCTS.ROOT, { replace: true });
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link to={ROUTES.PRIVATE.PRODUCTS.ROOT}>
          <ArrowLeft />
          Back to products
        </Link>
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
              {item.name}
            </h1>
            {item.isFeatured && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3 text-amber-500" />
                Featured
              </Badge>
            )}
            <Badge
              variant={item.isActive ? 'outline' : 'destructive'}
              className={
                item.isActive
                  ? 'border-green-200 text-green-700 dark:border-green-900 dark:text-green-400'
                  : undefined
              }
            >
              {item.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="font-mono text-xs text-stone-400 dark:text-stone-500">
            /{item.slug}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={ROUTES.PRIVATE.PRODUCTS.EDIT(item.slug)}>
              <Pencil />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProductGallery images={item.images} name={item.name} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Price
                  </dt>
                  <dd className="mt-0.5 text-base font-semibold tabular-nums text-stone-900 dark:text-stone-50">
                    {formatPrice(item.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Stock
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-medium tabular-nums text-stone-900 dark:text-stone-50">
                    <Boxes className="size-4 text-stone-400" />
                    {item.stock}
                    {item.stock === 0 && (
                      <Badge variant="destructive">Out of stock</Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Category
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-50">
                    <FolderTree className="size-4 text-stone-400" />
                    <Link
                      to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?categoryId=${item.categoryId}`}
                      className="hover:underline"
                    >
                      {item.category.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Created
                  </dt>
                  <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                    {formatDateTime(item.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Updated
                  </dt>
                  <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                    {formatDateTime(item.updatedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500 dark:text-stone-400">
                    Images
                  </dt>
                  <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                    {item.images.length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                  {item.description}
                </p>
              ) : (
                <p className="text-sm text-stone-400 dark:text-stone-500">
                  No description.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ProductTestimonials product={item} />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
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
              {item.name}
            </span>{' '}
            and all {item.testimonialCount} of its testimonials. This cannot be
            undone.
          </p>
        }
      />
    </div>
  );
};

export default ProductDetailPage;
