import { useEffect, useRef } from 'react';

export default function useDocumentTitle(title) {
  const prevTitle = useRef(document.title);

  useEffect(() => {
    const previous = prevTitle.current;
    document.title = title ? `${title} | mate.eus` : 'mate.eus — Matematika Euskaraz';
    return () => { document.title = previous; };
  }, [title]);
}
