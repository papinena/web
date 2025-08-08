import { useNavigate } from "react-router";
import { useNewPostStore } from "~/stores/new-post";
import { PostForm } from "./post-form";
import type { CreatePostType } from "~/parsers/create-post";

export default function NewPost() {
  const navigate = useNavigate();
  const { setPost, post } = useNewPostStore();

  const onSave = (data: CreatePostType, files: File[]) => {
    setPost(data, files);
    navigate("/user/new-post/preview");
  };

  return <PostForm onSave={onSave} initialValues={post} />;
}
