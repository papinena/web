import { useState, useEffect, useRef } from "react";
import type { Tag } from "~/interfaces/tag";

export function useTags(initialTags: Tag[] | undefined) {
  const [tags, setTags] = useState<Tag[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags);
    }
  }, [initialTags]);

  function onAddCustomTag() {
    const label = tagInputRef.current?.value.toLowerCase();

    if (!label) return;

    setTags((s) => {
      const i = s.findIndex((i) => i.label.toLowerCase() === label);
      if (i > -1) return s;
      const id = Math.max(...s.map((t) => t.id), 0) + 1;
      return [...s, { id, label }];
    });

    if (tagInputRef.current) {
      tagInputRef.current.value = "";
    }
  }

  return {
    tags,
    onAddCustomTag,
    tagInputRef,
  };
}
