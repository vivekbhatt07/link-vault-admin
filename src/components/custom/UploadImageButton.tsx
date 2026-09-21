import { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/api/error';
import { isImageUploadConfigured, uploadImage } from '@/helpers/upload';

type TUploadImageButtonProps = {
  onUploaded: (urls: string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
};

/**
 * Renders nothing unless VITE_CLOUDINARY_* is configured. Uploads go straight
 * to the third-party host; only the resulting URL is sent to the backend.
 */
const UploadImageButton = ({
  onUploaded,
  disabled,
  multiple = false,
}: TUploadImageButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isImageUploadConfigured) return null;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setIsUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        uploaded.push(await uploadImage(file));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Image upload failed'));
    } finally {
      setIsUploading(false);
      // Hand back everything that succeeded, in one call, so callers can
      // append to the latest value rather than a stale closure.
      if (uploaded.length > 0) onUploaded(uploaded);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        startAdornment={
          isUploading ? <Loader2 className="animate-spin" /> : <Upload />
        }
      >
        {isUploading ? 'Uploading…' : 'Upload'}
      </Button>
    </>
  );
};

export default UploadImageButton;
