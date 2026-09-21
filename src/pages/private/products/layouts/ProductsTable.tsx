import { Link } from 'react-router';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import ImageThumb from '@/components/custom/ImageThumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { formatDate, formatPrice } from '@/helpers/format';
import type { Product } from '@/types/api';

type TProductsTableProps = {
  products: Product[];
  isBusy?: boolean;
  onToggleFeatured: (product: Product, isFeatured: boolean) => void;
  onDeactivate: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const ProductsTable = ({
  products,
  isBusy,
  onToggleFeatured,
  onDeactivate,
  onDelete,
}: TProductsTableProps) => (
  <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900">
    <Table>
      <TableHeader className="bg-stone-50 dark:bg-stone-800/50">
        <TableRow>
          <TableHead className="min-w-56">Product</TableHead>
          <TableHead className="w-28 text-right">Price</TableHead>
          <TableHead className="hidden w-20 text-right sm:table-cell">
            Stock
          </TableHead>
          <TableHead className="hidden lg:table-cell">Category</TableHead>
          <TableHead className="w-24 text-center">Featured</TableHead>
          <TableHead className="w-20 text-center">Active</TableHead>
          <TableHead className="hidden w-32 xl:table-cell">Updated</TableHead>
          <TableHead className="w-28 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                <ImageThumb
                  src={product.images[0]}
                  alt={product.name}
                  className="size-10"
                />
                <div className="min-w-0">
                  <Link
                    to={ROUTES.PRIVATE.PRODUCTS.DETAIL(product.slug)}
                    className="line-clamp-1 text-sm leading-snug font-medium text-stone-900 transition-colors hover:text-accent-600 dark:text-stone-50 dark:hover:text-accent-400"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 truncate font-mono text-xs text-stone-400 dark:text-stone-500">
                    {product.slug}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="text-right text-sm font-medium tabular-nums whitespace-nowrap text-stone-900 dark:text-stone-50">
              {formatPrice(product.price)}
            </TableCell>

            <TableCell className="hidden text-right tabular-nums sm:table-cell">
              {product.stock === 0 ? (
                <Badge variant="destructive">0</Badge>
              ) : (
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {product.stock}
                </span>
              )}
            </TableCell>

            <TableCell className="hidden lg:table-cell">
              <Badge variant="secondary">{product.category.name}</Badge>
            </TableCell>

            <TableCell className="text-center">
              <Switch
                checked={product.isFeatured}
                onCheckedChange={(checked) =>
                  onToggleFeatured(product, checked)
                }
                disabled={isBusy}
                aria-label={
                  product.isFeatured
                    ? `Remove ${product.name} from featured`
                    : `Feature ${product.name}`
                }
              />
            </TableCell>

            <TableCell className="text-center">
              <Switch
                checked={product.isActive}
                onCheckedChange={(checked) => {
                  if (!checked) onDeactivate(product);
                }}
                disabled={isBusy}
                aria-label={`Deactivate ${product.name}`}
              />
            </TableCell>

            <TableCell className="hidden text-xs whitespace-nowrap text-stone-500 xl:table-cell dark:text-stone-400">
              {formatDate(product.updatedAt)}
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  aria-label="View"
                >
                  <Link to={ROUTES.PRIVATE.PRODUCTS.DETAIL(product.slug)}>
                    <Eye className="text-stone-400" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  aria-label="Edit"
                >
                  <Link to={ROUTES.PRIVATE.PRODUCTS.EDIT(product.slug)}>
                    <Pencil className="text-stone-400" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(product)}
                  aria-label={`Delete ${product.name}`}
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
);

export default ProductsTable;
