import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TAccentColor } from '../types';

type TAccentColorButtonProps = TAccentColor & {
  isSelected: boolean;
  onClick: (value: string) => void;
};

const AccentColorButton = ({
  value,
  hex,
  isSelected,
  onClick,
}: TAccentColorButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={value}
      onClick={() => onClick(value)}
      className="rounded-full hover:bg-transparent"
      style={{ backgroundColor: hex }}
    >
      {isSelected && (
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      )}
    </Button>
  );
};

export default AccentColorButton;
