import { useNavigate } from "react-router";
import { useAdminNewPostStore } from "~/stores/admin-new-post";
import { AdminPostForm } from "~/components/post/admin-post-form";
import type { CreateAdminPostType } from "~/parsers/create-admin-post";

export default function NewAdminPost() {
  const navigate = useNavigate();
  const { setPost, post } = useAdminNewPostStore();

  const onSave = (data: CreateAdminPostType) => {
    setPost(data);
    navigate("/post/admin/preview");
  };

  const previews = post?.photos?.map((file) => URL.createObjectURL(file));

  return (
    <AdminPostForm previews={previews} onSave={onSave} initialValues={post} />
  );
}
