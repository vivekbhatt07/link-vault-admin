import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import PageHeader from '@/components/custom/PageHeader';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { applyApiFieldErrors } from '@/helpers/form';
import { useCreateProduct } from '@/hooks/products';

import ProductForm from '../layouts/ProductForm';
import type { TProductFormData } from '../types';

const DEFAULT_VALUES: TProductFormData = {
  name: '',
  description: '',
  price: Number.NaN,
  stock: 0,
  categoryId: '',
  images: [],
  isFeatured: false,
  isActive: true,
};

const CreateProductPage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleSubmit: React.ComponentProps<typeof ProductForm>['onSubmit'] = (
    data,
    form,
  ) => {
    createProduct.mutate(
      {
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        stock: data.stock,
        isFeatured: data.isFeatured,
        images: data.images,
        ...(data.description && { description: data.description }),
      },
      {
        onSuccess: (response) => {
          navigate(
            response.data
              ? ROUTES.PRIVATE.PRODUCTS.DETAIL(response.data.slug)
              : ROUTES.PRIVATE.PRODUCTS.ROOT,
            { replace: true },
          );
        },
        onError: (error) => {
          applyApiFieldErrors(form, error);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link to={ROUTES.PRIVATE.PRODUCTS.ROOT}>
          <ArrowLeft />
          Back to products
        </Link>
      </Button>

      <PageHeader
        title="New product"
        description="Products are created active and visible on the storefront immediately."
      />

      <ProductForm
        mode="create"
        defaultValues={DEFAULT_VALUES}
        isPending={createProduct.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.PRIVATE.PRODUCTS.ROOT)}
      />
    </div>
  );
};

export default CreateProductPage;
