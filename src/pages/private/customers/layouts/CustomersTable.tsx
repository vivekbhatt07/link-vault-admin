import { BadgeCheck, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, getDisplayName, getInitials } from '@/helpers/format';
import type { User } from '@/types/api';

type TCustomersTableProps = {
  users: User[];
};

/** Read-only — there is no user detail, edit, delete, or role-change endpoint. */
const CustomersTable = ({ users }: TCustomersTableProps) => (
  <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700/60 dark:bg-stone-900">
    <Table>
      <TableHeader className="bg-stone-50 dark:bg-stone-800/50">
        <TableRow>
          <TableHead className="min-w-48">Name</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="w-24 text-center">Role</TableHead>
          <TableHead className="hidden w-28 text-center md:table-cell">
            Verified
          </TableHead>
          <TableHead className="hidden w-32 lg:table-cell">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="group">
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0 border border-stone-200 transition-transform duration-300 group-hover:scale-105 dark:border-stone-800">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={getDisplayName(user)}
                  />
                  <AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-50">
                    {getDisplayName(user)}
                  </p>
                  <p className="truncate text-xs text-stone-400 sm:hidden dark:text-stone-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="hidden text-sm text-stone-700 sm:table-cell dark:text-stone-300">
              {user.email}
            </TableCell>

            <TableCell className="text-center">
              {user.role === 'ADMIN' ? (
                <Badge variant="accent">
                  <ShieldCheck />
                  Admin
                </Badge>
              ) : (
                <Badge variant="secondary">Customer</Badge>
              )}
            </TableCell>

            <TableCell className="hidden text-center md:table-cell">
              {user.isVerified ? (
                <Badge variant="success">
                  <BadgeCheck />
                  Verified
                </Badge>
              ) : (
                <Badge variant="warning">Unverified</Badge>
              )}
            </TableCell>

            <TableCell className="hidden text-xs whitespace-nowrap text-stone-500 lg:table-cell dark:text-stone-400">
              {formatDate(user.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default CustomersTable;
