import { Link as RouterLink } from 'react-router';
import {
  ArrowRight,
  FolderTree,
  Package,
  Plus,
  Sparkles,
  Star,
} from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import ImageThumb from '@/components/custom/ImageThumb';
import PageHeader from '@/components/custom/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { formatDate, formatPrice } from '@/helpers/format';
import { useCategories } from '@/hooks/categories';
import { useProducts } from '@/hooks/products';

import StatCard from './layouts/StatCard';

const RECENT_LIMIT = 5;

/**
 * There is no stats endpoint. Everything here is derived from three reads:
 * the category list, the first page of products (its `total` is the active
 * product count), and a 1-item featured query for its `total`.
 */
const DashboardPage = () => {
  const categories = useCategories();
  const recentProducts = useProducts({ limit: RECENT_LIMIT });
  const featuredProducts = useProducts({ isFeatured: true, limit: 1 });

  const categoryCount = categories.data?.length;
  const activeCount = recentProducts.data?.total;
  const featuredCount = featuredProducts.data?.total;
  const recent = recentProducts.data?.items ?? [];

  return (
    <div className="flex w-full flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="An overview of the Pahadi Shilpkar catalog."
        actions={
          <Button asChild>
            <RouterLink to={ROUTES.PRIVATE.PRODUCTS.CREATE}>
              <Plus />
              New product
            </RouterLink>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={
            <FolderTree className="size-5 text-stone-500 dark:text-stone-400" />
          }
          label="Categories"
          value={categoryCount}
          isLoading={categories.isPending}
          to={ROUTES.PRIVATE.CATEGORIES}
        />
        <StatCard
          icon={
            <Package className="size-5 text-stone-500 dark:text-stone-400" />
          }
          label="Active products"
          value={activeCount}
          isLoading={recentProducts.isPending}
          to={ROUTES.PRIVATE.PRODUCTS.ROOT}
        />
        <StatCard
          icon={<Star className="size-5 text-amber-500" />}
          label="Featured products"
          value={featuredCount}
          isLoading={featuredProducts.isPending}
          to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?isFeatured=true`}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">
            Recent products
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <RouterLink to={ROUTES.PRIVATE.PRODUCTS.ROOT}>
              View all
              <ArrowRight className="size-3.5" />
            </RouterLink>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentProducts.isPending ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className="flex items-center gap-3 px-4 py-3">
                  <div className="size-10 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                    <div className="h-2.5 w-1/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                  </div>
                </li>
              ))}
            </ul>
          ) : recent.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {recent.map((product) => (
                <li key={product.id}>
                  <RouterLink
                    to={ROUTES.PRIVATE.PRODUCTS.DETAIL(product.slug)}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
                  >
                    <ImageThumb
                      src={product.images[0]}
                      alt={product.name}
                      className="size-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm leading-snug font-medium text-stone-900 dark:text-stone-50">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                        {product.category.name} ·{' '}
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {product.isFeatured && (
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="size-3 text-amber-500" />
                          Featured
                        </Badge>
                      )}
                      <span className="text-sm font-medium tabular-nums text-stone-900 dark:text-stone-50">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </RouterLink>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Package className="size-5" />}
              title="No products yet"
              description="Create your first product to see it here."
              className="py-10"
              action={
                <Button size="sm" asChild>
                  <RouterLink to={ROUTES.PRIVATE.PRODUCTS.CREATE}>
                    <Plus />
                    New product
                  </RouterLink>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
