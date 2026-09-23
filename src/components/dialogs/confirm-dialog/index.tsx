import { useState } from 'react';
import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type TConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  /** When set, the admin must type this exact text to enable confirm. */
  confirmText?: string;
  isPending?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
};

/**
 * Body lives in its own component so the typed-confirmation state resets
 * naturally: Radix unmounts DialogContent whenever the dialog closes.
 */
const ConfirmDialogBody = ({
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  confirmText,
  isPending = false,
  onConfirm,
  children,
}: Omit<TConfirmDialogProps, 'open'>) => {
  const [typed, setTyped] = useState('');

  const requiresTyping = Boolean(confirmText);
  const isConfirmEnabled = !requiresTyping || typed === confirmText;
  const isDestructive = variant === 'destructive';
  const Icon = isDestructive ? AlertTriangle : HelpCircle;

  return (
    <>
      <div className="flex items-start gap-4 pr-6">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            isDestructive
              ? 'bg-red-50 text-red-600 ring-8 ring-red-50/50 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-950/20'
              : 'bg-accent-50 text-accent-600 ring-8 ring-accent-50/50 dark:bg-accent-950/50 dark:text-accent-400 dark:ring-accent-950/20',
          )}
        >
          <Icon className="size-5" />
        </div>
        <DialogHeader className="pt-1.5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div>{description}</div>
          </DialogDescription>
        </DialogHeader>
      </div>

      {children}

      {requiresTyping && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-stone-700 dark:text-stone-300">
            Type{' '}
            <span className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {confirmText}
            </span>{' '}
            to confirm.
          </p>
          <Input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && isConfirmEnabled && !isPending) {
                onConfirm();
              }
            }}
            placeholder={confirmText}
            autoComplete="off"
            autoFocus
            disabled={isPending}
            className={cn(
              isConfirmEnabled &&
                'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15 dark:border-red-500/70',
            )}
          />
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={variant}
          onClick={onConfirm}
          disabled={!isConfirmEnabled || isPending}
          startAdornment={
            isPending ? <Loader2 className="animate-spin" /> : undefined
          }
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </>
  );
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  isPending,
  ...props
}: TConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
    <DialogContent>
      <ConfirmDialogBody
        onOpenChange={onOpenChange}
        isPending={isPending}
        {...props}
      />
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
