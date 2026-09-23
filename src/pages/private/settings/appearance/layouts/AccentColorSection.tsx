import { Palette } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SettingsSection from '../../components/SettingsSection';
import AccentColorButton from '../components/AccentColorButton';
import { ACCENT_COLORS } from '../constants';

type TAccentColorSectionProps = {
  selectedAccent: string;
  onAccentChange: (value: string) => void;
};

const AccentColorSection = ({
  selectedAccent,
  onAccentChange,
}: TAccentColorSectionProps) => (
  <SettingsSection
    icon={<Palette />}
    title="Accent colour"
    description="Used for buttons, links, focus rings and highlights."
  >
    <div className="flex flex-wrap items-center gap-3">
      {ACCENT_COLORS.map((accent) => (
        <AccentColorButton
          key={accent.value}
          {...accent}
          isSelected={selectedAccent === accent.value}
          onClick={onAccentChange}
        />
      ))}
    </div>

    {/* Live preview of the accent on real components */}
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/60 p-4 dark:border-stone-700 dark:bg-stone-800/20">
      <span className="w-full text-[11px] font-semibold tracking-wider text-stone-400 uppercase dark:text-stone-500">
        Preview
      </span>
      <Button size="sm" type="button" tabIndex={-1}>
        Primary action
      </Button>
      <Badge variant="accent">New</Badge>
      <Switch defaultChecked aria-label="Preview switch" tabIndex={-1} />
      <span className="text-sm font-medium text-accent-600 underline-offset-4 hover:underline dark:text-accent-400">
        A link
      </span>
    </div>
  </SettingsSection>
);

export default AccentColorSection;
