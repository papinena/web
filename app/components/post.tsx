import type { ReactNode } from "react";
import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { DateFormatter } from "~/utils/date-formatter";
import { cn } from "~/lib/utils";
import type { EmployeePostAPIProps, UserPostAPIProps } from "~/interfaces/post";
import { Image } from "./ui/image";
import { formatPostNetworks } from "~/utils/get-user-networks";

// --- Sub-components ---

interface SubComponentProps {
  className?: string;
  format?: string;
}

function PostTitle({
  post,
  className,
}: SubComponentProps & { post: { title: string } }) {
  return (
    <Text className={cn("text-md font-bold text-blue-primary", className)}>
      {post.title}
    </Text>
  );
}

function PostResume({
  post,
  className,
}: SubComponentProps & { post: { resume: string } }) {
  return <Text className={cn("", className)}>{post.resume}</Text>;
}

function PostCreatedAt({
  post,
  className,
  format,
}: SubComponentProps & { post: { createdAt: Date | string } }) {
  const formattedDate = DateFormatter.format(post.createdAt, format);
  return (
    <Text className={cn("text-gray-300", className)}>{formattedDate}</Text>
  );
}

function PostNetworks({
  post,
  className,
}: SubComponentProps & { post: { social: string } }) {
  if (!post.social) return null;

  const [ig, fb] = formatPostNetworks(post.social);

  if (!ig && !fb) return null;

  return (
    <Box className={cn("flex-col", className)}>
      {ig && (
        <Box className="flex items-center gap-1.5">
          <Image src="/instagram.svg" className="size-5" />
          <Text>{ig}</Text>
        </Box>
      )}
      {ig && (
        <Box className="flex items-center gap-1.5">
          <Image src="/facebook.svg" className="size-5" />
          <Text>{fb}</Text>
        </Box>
      )}
    </Box>
  );
}

// --- Main Component ---

interface PostProps {
  post: UserPostAPIProps | EmployeePostAPIProps;
  children: ReactNode;
  className?: string;
  to?: string;
}

interface PostComposition {
  Title: typeof PostTitle;
  Resume: typeof PostResume;
  CreatedAt: typeof PostCreatedAt;
  Networks: typeof PostNetworks;
}

export const Post: React.FC<PostProps> & PostComposition = ({
  post,
  children,
  className,
  to,
}) => {
  return (
    <Link to={to ?? `/post/${post.id}`} className={cn("w-full", className)}>
      {children}
    </Link>
  );
};

Post.Title = PostTitle;
Post.Resume = PostResume;
Post.CreatedAt = PostCreatedAt;
Post.Networks = PostNetworks;
