import { useNavigate } from "react-router";
import { useNewPostStore } from "~/stores/new-post";
import { PostForm } from "./post-form";
import type { CreatePostType } from "~/parsers/create-post";
import { RouteContainer } from "~/components/route-container";

export default function NewPost() {
  const navigate = useNavigate();
  const { setPost, post } = useNewPostStore();

  const onSave = (data: CreatePostType) => {
    setPost(data);
    navigate("/post/create/preview");
  };

  return (
    <RouteContainer>
      <PostForm onSave={onSave} initialValues={post} />
    </RouteContainer>
  );
}
