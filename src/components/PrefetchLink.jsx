import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function PrefetchLink({ to, importFn, children, ...props }) {
  const ref = useRef(null);
  const prefetched = useRef(false);

  useEffect(() => {
    if (!importFn || prefetched.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !prefetched.current) {
          prefetched.current = true;
          importFn();
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [importFn]);

  return (
    <Link ref={ref} to={to} {...props}>
      {children}
    </Link>
  );
}
