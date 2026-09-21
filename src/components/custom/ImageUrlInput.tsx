import { Input } from '@/components/ui/input';
import ImageThumb from './ImageThumb';
import UploadImageButton from './UploadImageButton';

type TImageUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  rounded?: 'md' | 'lg' | 'full';
  alt?: string;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

/** Single image field: paste a URL (and/or upload when configured). */
const ImageUrlInput = ({
  value,
  onChange,
  onBlur,
  placeholder = 'https://example.com/image.jpg',
  disabled,
  rounded = 'lg',
  alt = 'Preview',
  ...inputProps
}: TImageUrlInputProps) => (
  <div className="flex items-center gap-3">
    <ImageThumb src={value} alt={alt} rounded={rounded} className="size-16" />
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onClear={() => onChange('')}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
      />
      <UploadImageButton
        onUploaded={(urls) => onChange(urls[0])}
        disabled={disabled}
      />
    </div>
  </div>
);

export default ImageUrlInput;
