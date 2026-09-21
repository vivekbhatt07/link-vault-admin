import { ACCENT_COLORS } from '../constants';
import AccentColorButton from '../components/AccentColorButton';

type TAccentColorSectionProps = {
  selectedAccent: string;
  onAccentChange: (value: string) => void;
};

const AccentColorSection = ({
  selectedAccent,
  onAccentChange,
}: TAccentColorSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Accent Color</h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred accent color.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {ACCENT_COLORS.map((accent) => (
          <AccentColorButton
            key={accent.value}
            {...accent}
            isSelected={selectedAccent === accent.value}
            onClick={onAccentChange}
          />
        ))}
      </div>
    </div>
  );
};

export default AccentColorSection;
