import dayjs from 'dayjs';

import type { User } from '@/types/api';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export const formatPrice = (price: number) => priceFormatter.format(price);

export const formatDate = (iso: string) => dayjs(iso).format('MMM D, YYYY');

export const formatDateTime = (iso: string) =>
  dayjs(iso).format('MMM D, YYYY · h:mm A');

type TNamed = Pick<User, 'firstName' | 'lastName'> & { email?: string };

export const getDisplayName = (user: TNamed | null | undefined) => {
  if (!user) return 'User';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return name || user.email || 'User';
};

export const getInitials = (user: TNamed | null | undefined) => {
  if (!user) return '?';
  const parts = [user.firstName, user.lastName].filter(Boolean) as string[];
  if (parts.length === 0) return (user.email?.[0] ?? '?').toUpperCase();
  return parts
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
