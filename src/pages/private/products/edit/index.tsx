import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, PackageX } from 'lucide-react';
import { toast } from 'sonner';

import EmptyState from '@/components/custom/EmptyState';
import PageHeader from '@/components/custom/PageHeader';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ROUTES } from '@/constants/routes';
import { applyApiFieldErrors, pickChangedFields } from '@/helpers/form';
import { useProduct, useUpdateProduct } from '@/hooks/products';
import type { Product, UpdateProductPayload } from '@/types/api';

import { DEACTIVATE_WARNING } from '../constants';
import ProductForm from '../layouts/ProductForm';
import type { TProductFormData } from '../types';

const toFormData = (product: Product): TProductFormData => ({
  name: product.name,
  slug: product.slug,
  sku: product.sku ?? '',
  shortDescription: product.shortDescription ?? '',
  description: product.description ?? '',
  highlights: product.highlights,
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  images: product.images,
  videoUrl: product.videoUrl ?? '',
  material: product.material ?? '',
  dimensions: product.dimensions ?? '',
  weight: product.weight ?? '',
  careInstructions: product.careInstructions ?? '',
  specifications: product.specifications,
  tags: product.tags,
  stock: product.stock,
  availability: product.availability,
  isFeatured: product.isFeatured,
  isBestseller: product.isBestseller,
  isActive: product.isActive,
  whatsappMessage: product.whatsappMessage ?? '',
  purchaseLinks: product.purchaseLinks.map((link) => ({
    ...link,
    label: link.label ?? '',
  })),
  metaTitle: product.metaTitle ?? '',
  metaDescription: product.metaDescription ?? '',
  categoryId: product.categoryId,
});

type TPendingSubmit = {
  payload: UpdateProductPayload;
  form: Parameters<React.ComponentProps<typeof ProductForm>['onSubmit']>[1];
};

const EditProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = useProduct(slug);
  const updateProduct = useUpdateProduct();
  const [pendingDeactivate, setPendingDeactivate] =
    useState<TPendingSubmit | null>(null);

  const submit = ({ payload, form }: TPendingSubmit) => {
    if (!product.data) return;

    updateProduct.mutate(
      { id: product.data.id, payload },
      {
        onSuccess: (response) => {
          setPendingDeactivate(null);
          navigate(
            response.data
              ? ROUTES.PRIVATE.PRODUCTS.DETAIL(response.data.slug)
              : ROUTES.PRIVATE.PRODUCTS.ROOT,
            { replace: true },
          );
        },
        onError: (error) => {
          setPendingDeactivate(null);
          applyApiFieldErrors(form, error);
        },
      },
    );
  };

  const handleSubmit: React.ComponentProps<typeof ProductForm>['onSubmit'] = (
    data,
    form,
  ) => {
    if (!product.data) return;

    // Only changed fields are sent; an unchanged name never regenerates the
    // slug, and array fields are sent whole whenever they changed at all.
    const changed = pickChangedFields(toFormData(product.data), data);
    if (Object.keys(changed).length === 0) {
      toast.info('No changes to save');
      return;
    }

    const payload: UpdateProductPayload = {
      ...(changed.name !== undefined && { name: changed.name }),
      ...(changed.slug !== undefined && changed.slug && { slug: changed.slug }),
      ...(changed.sku !== undefined && { sku: changed.sku || null }),
      ...(changed.shortDescription !== undefined && {
        shortDescription: changed.shortDescription || null,
      }),
      ...(changed.description !== undefined && {
        description: changed.description || null,
      }),
      ...(changed.highlights !== undefined && {
        highlights: changed.highlights,
      }),
      ...(changed.price !== undefined && { price: changed.price }),
      ...(changed.compareAtPrice !== undefined && {
        compareAtPrice: changed.compareAtPrice,
      }),
      ...(changed.images !== undefined && { images: changed.images }),
      ...(changed.videoUrl !== undefined && {
        videoUrl: changed.videoUrl || null,
      }),
      ...(changed.material !== undefined && {
        material: changed.material || null,
      }),
      ...(changed.dimensions !== undefined && {
        dimensions: changed.dimensions || null,
      }),
      ...(changed.weight !== undefined && { weight: changed.weight || null }),
      ...(changed.careInstructions !== undefined && {
        careInstructions: changed.careInstructions || null,
      }),
      ...(changed.specifications !== undefined && {
        specifications: changed.specifications,
      }),
      ...(changed.tags !== undefined && { tags: changed.tags }),
      ...(changed.stock !== undefined && { stock: changed.stock }),
      ...(changed.availability !== undefined && {
        availability: changed.availability,
      }),
      ...(changed.isFeatured !== undefined && {
        isFeatured: changed.isFeatured,
      }),
      ...(changed.isBestseller !== undefined && {
        isBestseller: changed.isBestseller,
      }),
      ...(changed.isActive !== undefined && { isActive: changed.isActive }),
      ...(changed.whatsappMessage !== undefined && {
        whatsappMessage: changed.whatsappMessage || null,
      }),
      ...(changed.purchaseLinks !== undefined && {
        purchaseLinks: changed.purchaseLinks.map((link) => ({
          ...link,
          label: link.label || null,
        })),
      }),
      ...(changed.metaTitle !== undefined && {
        metaTitle: changed.metaTitle || null,
      }),
      ...(changed.metaDescription !== undefined && {
        metaDescription: changed.metaDescription || null,
      }),
      ...(changed.categoryId !== undefined && {
        categoryId: changed.categoryId,
      }),
    };

    if (payload.isActive === false) {
      setPendingDeactivate({ payload, form });
      return;
    }
    submit({ payload, form });
  };

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

  const current = product.data;

  return (
    <div className="flex w-full flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link to={ROUTES.PRIVATE.PRODUCTS.DETAIL(current.slug)}>
          <ArrowLeft />
          Back to product
        </Link>
      </Button>

      <PageHeader title={`Edit: ${current.name}`} />

      <ProductForm
        key={current.id}
        mode="edit"
        product={current}
        defaultValues={toFormData(current)}
        isPending={updateProduct.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.PRIVATE.PRODUCTS.DETAIL(current.slug))}
      />

      <ConfirmDialog
        open={pendingDeactivate !== null}
        onOpenChange={(open) => !open && setPendingDeactivate(null)}
        title="Deactivate this product?"
        variant="destructive"
        confirmLabel="Save and deactivate"
        isPending={updateProduct.isPending}
        onConfirm={() => pendingDeactivate && submit(pendingDeactivate)}
        description={
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium text-stone-900 dark:text-stone-50">
                {current.name}
              </span>{' '}
              will disappear from the storefront.
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              {DEACTIVATE_WARNING}
            </p>
          </div>
        }
      />
    </div>
  );
};

export default EditProductPage;
