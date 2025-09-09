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
  const [node, setNode] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = (currentNode: HTMLElement | null) => {
    setNode(currentNode);
  };

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    const { current: currentObserver } = observer;
    if (node) {
      currentObserver.observe(node);
    }

    return () => {
      currentObserver.disconnect();
    };
  }, [node, options.root, options.rootMargin, options.threshold]);

  return { ref, isIntersecting, entry };
}
