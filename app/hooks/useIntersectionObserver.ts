import { useEffect, useRef, useState } from "react";

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    const { current: currentObserver } = observer;
    if (ref.current) {
      currentObserver.observe(ref.current);
    }

    return () => {
      currentObserver.disconnect();
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref, isIntersecting, entry };
}
