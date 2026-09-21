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
  description: product.description ?? '',
  price: product.price,
  stock: product.stock,
  categoryId: product.categoryId,
  images: product.images,
  isFeatured: product.isFeatured,
  isActive: product.isActive,
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
    const deactivating = payload.isActive === false;

    updateProduct.mutate(
      { id: product.data.id, payload },
      {
        onSuccess: (response) => {
          setPendingDeactivate(null);
          // A deactivated product 404s on its detail page.
          if (deactivating || !response.data) {
            navigate(ROUTES.PRIVATE.PRODUCTS.ROOT, { replace: true });
            return;
          }
          navigate(ROUTES.PRIVATE.PRODUCTS.DETAIL(response.data.slug), {
            replace: true,
          });
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
    // slug, and `images` is sent whole whenever it changed at all.
    const changed = pickChangedFields(toFormData(product.data), data);
    if (Object.keys(changed).length === 0) {
      toast.info('No changes to save');
      return;
    }

    // TODO(backend): the contract does not say how to clear `description`;
    // `null` is sent for a cleared value.
    const payload: UpdateProductPayload = {
      ...(changed.name !== undefined && { name: changed.name }),
      ...(changed.description !== undefined && {
        description: changed.description || null,
      }),
      ...(changed.price !== undefined && { price: changed.price }),
      ...(changed.stock !== undefined && { stock: changed.stock }),
      ...(changed.categoryId !== undefined && {
        categoryId: changed.categoryId,
      }),
      ...(changed.images !== undefined && { images: changed.images }),
      ...(changed.isFeatured !== undefined && {
        isFeatured: changed.isFeatured,
      }),
      ...(changed.isActive !== undefined && { isActive: changed.isActive }),
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
              will disappear from the storefront and from this panel.
            </p>
            <p className="font-medium text-red-600 dark:text-red-400">
              {DEACTIVATE_WARNING}
            </p>
            <p>An Undo action is offered briefly after saving.</p>
          </div>
        }
      />
    </div>
  );
};

export default EditProductPage;
