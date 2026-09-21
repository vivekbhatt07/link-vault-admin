import type z from 'zod';
import type { productFormSchema } from '../schemas';

export type TProductFormData = z.infer<typeof productFormSchema>;

export type TProductFormMode = 'create' | 'edit';
