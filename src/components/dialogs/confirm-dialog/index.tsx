import { useState } from 'react';
import { Loader2 } from 'lucide-react';

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

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription asChild>
          <div>{description}</div>
        </DialogDescription>
      </DialogHeader>

      {children}

      {requiresTyping && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-stone-700 dark:text-stone-300">
            Type{' '}
            <span className="font-mono font-semibold text-red-600 dark:text-red-400">
              {confirmText}
            </span>{' '}
            to confirm.
          </p>
          <Input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={confirmText}
            autoComplete="off"
            disabled={isPending}
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
