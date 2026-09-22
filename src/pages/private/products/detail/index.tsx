import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Boxes,
  ExternalLink,
  FolderTree,
  PackageX,
  Pencil,
  Sparkles,
  Trash2,
  TrendingUp,
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

import { AVAILABILITY_OPTIONS, PRODUCT_DELETE_CONFIRMATION } from '../constants';
import ProductGallery from './layouts/ProductGallery';
import ProductTestimonials from './layouts/ProductTestimonials';

const AVAILABILITY_LABELS = Object.fromEntries(
  AVAILABILITY_OPTIONS.map((option) => [option.value, option.label]),
);

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
        description="It may have been deleted."
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

      {item.breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
          {item.breadcrumbs.map((crumb, index) => (
            <span key={crumb.id} className="flex items-center gap-1">
              {index > 0 && <span>/</span>}
              <Link
                to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?categoryId=${crumb.id}`}
                className="hover:underline"
              >
                {crumb.name}
              </Link>
            </span>
          ))}
        </nav>
      )}

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
            {item.isBestseller && (
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="size-3 text-amber-500" />
                Bestseller
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
            <Badge
              variant={item.availability === 'IN_STOCK' ? 'default' : 'secondary'}
            >
              {AVAILABILITY_LABELS[item.availability]}
            </Badge>
          </div>
          <p className="font-mono text-xs text-stone-400 dark:text-stone-500">
            /{item.slug} {item.sku && `· SKU ${item.sku}`}
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
                  <dd className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-base font-semibold tabular-nums text-stone-900 dark:text-stone-50">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice !== null && (
                      <span className="text-xs tabular-nums text-stone-400 line-through dark:text-stone-500">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                    {item.discountPercentage !== null && (
                      <Badge variant="destructive">
                        {item.discountPercentage}% off
                      </Badge>
                    )}
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
                    Rating
                  </dt>
                  <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                    {item.avgRating.toFixed(1)} ({item.testimonialCount})
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
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {item.shortDescription && (
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {item.shortDescription}
                </p>
              )}
              {item.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                  {item.description}
                </p>
              ) : (
                <p className="text-sm text-stone-400 dark:text-stone-500">
                  No description.
                </p>
              )}
              {item.highlights.length > 0 && (
                <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-stone-700 dark:text-stone-300">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {(item.material || item.dimensions || item.weight ||
            item.careInstructions || item.specifications.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Craft details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  {item.material && (
                    <div>
                      <dt className="text-xs text-stone-500 dark:text-stone-400">
                        Material
                      </dt>
                      <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                        {item.material}
                      </dd>
                    </div>
                  )}
                  {item.dimensions && (
                    <div>
                      <dt className="text-xs text-stone-500 dark:text-stone-400">
                        Dimensions
                      </dt>
                      <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                        {item.dimensions}
                      </dd>
                    </div>
                  )}
                  {item.weight && (
                    <div>
                      <dt className="text-xs text-stone-500 dark:text-stone-400">
                        Weight
                      </dt>
                      <dd className="mt-0.5 text-stone-700 dark:text-stone-300">
                        {item.weight}
                      </dd>
                    </div>
                  )}
                </dl>
                {item.careInstructions && (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                    {item.careInstructions}
                  </p>
                )}
                {item.specifications.length > 0 && (
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {item.specifications.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-2 border-b border-stone-100 pb-1.5 dark:border-stone-800">
                        <dt className="text-stone-500 dark:text-stone-400">
                          {spec.label}
                        </dt>
                        <dd className="text-right font-medium text-stone-700 dark:text-stone-300">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </CardContent>
            </Card>
          )}

          {(item.purchaseLinks.length > 0 || item.whatsappUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Where to buy
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {item.whatsappUrl && (
                  <a
                    href={item.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent-600 hover:underline dark:text-accent-400"
                  >
                    WhatsApp
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
                {item.purchaseLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent-600 hover:underline dark:text-accent-400"
                  >
                    {link.label || link.platform}
                    <ExternalLink className="size-3.5" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
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
