import {
  BoldItalicUnderlineToggles,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { useState } from "react";

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  return (
    <MDXEditor
      contentEditableClassName="prose"
      onChange={setMarkdown}
      markdown={markdown}
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
