import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TSettingsSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Titled card grouping related settings fields. */
const SettingsSection = ({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
}: TSettingsSectionProps) => (
  <Card className={className}>
    <CardHeader>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 [&_svg]:size-4">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs sm:text-sm">
              {description}
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className={cn('flex flex-col gap-4', contentClassName)}>
      {children}
    </CardContent>
  </Card>
);

export default SettingsSection;
