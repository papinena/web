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

interface MarkdownEditorProps {
  value?: string;
  onChange?: (markdown: string) => void;
  onBlur?: () => void;
  name?: string;
}

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  ({ value, onChange, onBlur, name }, ref) => {
    return (
      <MDXEditor
        ref={ref}
        markdown={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        contentEditableClassName="prose"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          toolbarPlugin({
            toolbarClassName: "my-classname",
            toolbarContents: () => (
              <>
                <BoldItalicUnderlineToggles />
                <ListsToggle />
              </>
            ),
          }),
        ]}
      />
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";