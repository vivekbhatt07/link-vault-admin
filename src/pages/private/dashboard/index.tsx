import { Link as RouterLink } from 'react-router';
import {
  AlertTriangle,
  ArrowRight,
  FolderTree,
  MessageSquare,
  Package,
  PackageCheck,
  Plus,
  Star,
  Users,
} from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import ImageThumb from '@/components/custom/ImageThumb';
import PageHeader from '@/components/custom/PageHeader';
import RatingStars from '@/components/custom/RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import {
  formatDate,
  formatDateTime,
  formatPrice,
  getDisplayName,
  getInitials,
} from '@/helpers/format';
import { useCategories } from '@/hooks/categories';
import { useProducts } from '@/hooks/products';
import { useSettings } from '@/hooks/settings';
import { useAllTestimonials } from '@/hooks/testimonials';
import { useUsers } from '@/hooks/users';

import StatCard from './layouts/StatCard';

const RECENT_LIMIT = 5;

/**
 * There is no stats endpoint. Every number here is a `total` (or array
 * length) derived from a `limit: 1` (or small-limit) list read, reusing the
 * same call for its list where one is shown, to avoid N+1 requests against
 * the 100-req/15-min rate limit.
 */
const DashboardPage = () => {
  const categories = useCategories({ includeInactive: true });
  const totalProducts = useProducts({ includeInactive: true, limit: 1 });
  const recentProducts = useProducts({ limit: RECENT_LIMIT });
  const featuredProducts = useProducts({ isFeatured: true, limit: 1 });
  const customers = useUsers({ limit: 1 });
  const testimonials = useAllTestimonials({ limit: RECENT_LIMIT });
  const settings = useSettings();

  const categoryCount = categories.data?.length;
  const totalProductCount = totalProducts.data?.total;
  const activeProductCount = recentProducts.data?.total;
  const featuredProductCount = featuredProducts.data?.total;
  const customerCount = customers.data?.total;
  const testimonialCount = testimonials.data?.total;
  const recentItems = recentProducts.data?.items ?? [];
  const latestTestimonials = testimonials.data?.items ?? [];
  const whatsappConfigured = Boolean(settings.data?.whatsappNumber);

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

      {!settings.isPending && !whatsappConfigured && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">The WhatsApp buy button is off</p>
            <p className="text-amber-800/80 dark:text-amber-200/70">
              Set a WhatsApp number in Store settings so every product gets a
              working buy button.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <RouterLink to={ROUTES.PRIVATE.SETTINGS.STORE}>
              Set it up
            </RouterLink>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
          label="Total products"
          value={totalProductCount}
          isLoading={totalProducts.isPending}
          to={ROUTES.PRIVATE.PRODUCTS.ROOT}
        />
        <StatCard
          icon={
            <PackageCheck className="size-5 text-stone-500 dark:text-stone-400" />
          }
          label="Active products"
          value={activeProductCount}
          isLoading={recentProducts.isPending}
          to={ROUTES.PRIVATE.PRODUCTS.ROOT}
        />
        <StatCard
          icon={<Star className="size-5 text-amber-500" />}
          label="Featured products"
          value={featuredProductCount}
          isLoading={featuredProducts.isPending}
          to={`${ROUTES.PRIVATE.PRODUCTS.ROOT}?isFeatured=true`}
        />
        <StatCard
          icon={
            <Users className="size-5 text-stone-500 dark:text-stone-400" />
          }
          label="Customers"
          value={customerCount}
          isLoading={customers.isPending}
          to={ROUTES.PRIVATE.CUSTOMERS}
        />
        <StatCard
          icon={
            <MessageSquare className="size-5 text-stone-500 dark:text-stone-400" />
          }
          label="Testimonials"
          value={testimonialCount}
          isLoading={testimonials.isPending}
          to={ROUTES.PRIVATE.TESTIMONIALS}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            ) : recentItems.length > 0 ? (
              <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                {recentItems.map((product) => (
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
                            <Star className="size-3 text-amber-500" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">
              Latest testimonials
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
              <RouterLink to={ROUTES.PRIVATE.TESTIMONIALS}>
                View all
                <ArrowRight className="size-3.5" />
              </RouterLink>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {testimonials.isPending ? (
              <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                {Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className="flex items-center gap-3 px-4 py-3">
                    <div className="size-9 shrink-0 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                      <div className="h-2.5 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : latestTestimonials.length > 0 ? (
              <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                {latestTestimonials.map((testimonial) => (
                  <li key={testimonial.id} className="flex gap-3 px-4 py-3">
                    <Avatar className="size-9 shrink-0 border border-stone-200 dark:border-stone-800">
                      <AvatarImage
                        src={testimonial.user.avatar || undefined}
                        alt={getDisplayName(testimonial.user)}
                      />
                      <AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {getInitials(testimonial.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
                          {getDisplayName(testimonial.user)}
                        </p>
                        <RatingStars rating={testimonial.rating} size={12} />
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
                        {testimonial.content}
                      </p>
                      <RouterLink
                        to={ROUTES.PRIVATE.PRODUCTS.DETAIL(
                          testimonial.product.slug,
                        )}
                        className="mt-0.5 block text-xs text-stone-400 hover:underline dark:text-stone-500"
                      >
                        on {testimonial.product.name} ·{' '}
                        {formatDateTime(testimonial.createdAt)}
                      </RouterLink>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<MessageSquare className="size-5" />}
                title="No testimonials yet"
                description="Customer testimonials will appear here once submitted."
                className="py-10"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
