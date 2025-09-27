import { MarkdownEditor } from "~/components/markdown-editor";
import { RouteContainer } from "~/components/route-container";
import { Box } from "~/components/ui/box";
import privacyPolicy from "~/utils/privacy-policy.md?raw";

export default function PrivacyPolicy() {
  return (
    <RouteContainer>
      <Box className="bg-white gap-5 flex-1 rounded-xl pt-3 px-3 pb-10 flex-col">
        <MarkdownEditor markdown={privacyPolicy} readOnly />
      </Box>
    </RouteContainer>
  );
}
