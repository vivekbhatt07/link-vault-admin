import { useEffect } from 'react';

/**
 * Asks the browser to confirm before a reload / tab close while a form has
 * unsaved edits. (In-app navigation can't be blocked with <BrowserRouter>.)
 */
export const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
};
