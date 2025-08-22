import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface MarkdownEditorProps {
  markdown?: string;
  onChange?: (markdown: string) => void;
  onBlur?: () => void;
  name?: string;
  readOnly?: boolean;
  contentEditableClassName?: string;
}

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  (
    { markdown, onChange, onBlur, contentEditableClassName, readOnly = false },
    ref
  ) => {
    const plugins = [headingsPlugin(), listsPlugin()];

    if (!readOnly) {
      plugins.push(
        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <ListsToggle />
            </>
          ),
        })
      );
    }

    return (
      <MDXEditor
        ref={ref}
        markdown={markdown || ""}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        contentEditableClassName={cn("prose", contentEditableClassName)}
        plugins={plugins}
      />
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";
