import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, useToast } from "@/components/ui";
import Loader from "@/components/shared/Loader";
import {
  useGetPostById,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/authContext";
import PostStats from "@/components/shared/PostStats";
import GridPostList from "@/components/shared/GridPostList";
import { Models } from "appwrite";
import { deletePost } from "@/lib/appwrite/api";
import { useCallback, useState } from "react";

export const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [deletingPost, setDeleting] = useState(false);
  const { data: post, isLoading } = useGetPostById(id as string);
  const { data: relatedPosts, isFetching: isRelatedPostsLoading } =
    useSearchPosts(post?.caption);
  const { toast } = useToast();
  const handleDeletePost = useCallback(async () => {
    const savedRecords = post?.save?.map((save: Models.Document) => save?.$id);
    setDeleting(true);
    const status = await deletePost(
      post?.$id as string,
      post?.imageId,
      savedRecords || []
    );
    if (status) {
      toast({ title: "Deleted Successfully" });
      navigate("/");
    } else {
      toast({
        title: "Something Went Wronge Please Try Agine",
        style: { backgroundColor: "white", color: "black", fontWeight: "bold" },
      });
    }
    setDeleting(false);
  }, [navigate, post, toast]);
  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                {deletingPost ? (
                  <div className="flex-center gap-2">
                    <Loader />
                  </div>
                ) : (
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ost_details-delete_btn ${
                      user.id !== post?.creator.$id && "hidden"
                    } ${deletingPost && "pointer-events-none"}`}
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {!relatedPosts?.documents || isRelatedPostsLoading ? (
          <Loader />
        ) : (
          <GridPostList
            showStats={false}
            posts={
              relatedPosts?.documents.filter(
                (post) => post.$id !== id
              ) as Models.Document[]
            }
          />
        )}
      </div>
    </div>
  );
};
