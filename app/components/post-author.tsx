import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import type { PostAuthorProps } from "~/services/get-post";

export function PostAuthor({ author }: { author?: PostAuthorProps }) {
  const { buildUrl } = useImageReadToken();

  if (!author) {
    return null;
  }

  return (
    <Box className="gap-2 items-center">
      <Avatar
        style={{ width: 40, height: 40 }}
        aria-label={author.name || author.name || "Avatar"}
      >
        <AvatarImage src={buildUrl(author.avatar ?? "")} />
        <AvatarFallback>{author.name?.[0] || author.name?.[0]}</AvatarFallback>
      </Avatar>
      <Box className="flex-col">
        <Text>{author.name}</Text>
        <Text>Bloco: {author.block}</Text>
      </Box>
    </Box>
  );
}
