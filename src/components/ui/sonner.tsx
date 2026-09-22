import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useAppearanceStore } from '@/store/appearanceStore';

const Toaster = (props: ToasterProps) => {
  const theme = useAppearanceStore((state) => state.theme);

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
