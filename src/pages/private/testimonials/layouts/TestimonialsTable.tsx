import { Link } from 'react-router';
import { Trash2 } from 'lucide-react';

import RatingStars from '@/components/custom/RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { ROUTES } from '@/constants/routes';
import { formatDateTime, getDisplayName, getInitials } from '@/helpers/format';
import type { TestimonialWithProduct } from '@/types/api';

type TTestimonialsTableProps = {
  testimonials: TestimonialWithProduct[];
  onDelete: (testimonial: TestimonialWithProduct) => void;
};

const TestimonialsTable = ({
  testimonials,
  onDelete,
}: TTestimonialsTableProps) => (
  <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700/60 dark:bg-stone-900">
    <Table>
      <TableHeader className="bg-stone-50 dark:bg-stone-800/50">
        <TableRow>
          <TableHead className="min-w-48">Author</TableHead>
          <TableHead className="hidden lg:table-cell">Product</TableHead>
          <TableHead className="w-28">Rating</TableHead>
          <TableHead className="min-w-64">Testimonial</TableHead>
          <TableHead className="hidden w-32 xl:table-cell">Posted</TableHead>
          <TableHead className="w-16 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testimonials.map((testimonial) => (
          <TableRow key={testimonial.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0 border border-stone-200 dark:border-stone-800">
                  <AvatarImage
                    src={testimonial.user.avatar || undefined}
                    alt={getDisplayName(testimonial.user)}
                  />
                  <AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    {getInitials(testimonial.user)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-stone-900 dark:text-stone-50">
                  {getDisplayName(testimonial.user)}
                </span>
              </div>
            </TableCell>

            <TableCell className="hidden lg:table-cell">
              <Link
                to={ROUTES.PRIVATE.PRODUCTS.DETAIL(testimonial.product.slug)}
                className="text-sm text-stone-700 transition-colors hover:text-accent-600 dark:text-stone-300 dark:hover:text-accent-400"
              >
                {testimonial.product.name}
              </Link>
            </TableCell>

            <TableCell>
              <RatingStars rating={testimonial.rating} size={13} />
            </TableCell>

            <TableCell>
              <p className="line-clamp-2 max-w-md text-sm leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                {testimonial.content}
              </p>
            </TableCell>

            <TableCell className="hidden text-xs whitespace-nowrap text-stone-500 xl:table-cell dark:text-stone-400">
              {formatDateTime(testimonial.createdAt)}
            </TableCell>

            <TableCell className="text-right">
              <SimpleTooltip label="Delete">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(testimonial)}
                  aria-label={`Delete testimonial by ${getDisplayName(testimonial.user)}`}
                  className="text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                >
                  <Trash2 />
                </Button>
              </SimpleTooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default TestimonialsTable;
