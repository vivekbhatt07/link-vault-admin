import { useEffect } from 'react';

const APP_TITLE = 'Pahadi Shilpkar Admin';

/** Sets the browser tab title to "<title> · Pahadi Shilpkar Admin". */
export const useDocumentTitle = (title: string | undefined) => {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_TITLE}` : APP_TITLE;
  }, [title]);
};
