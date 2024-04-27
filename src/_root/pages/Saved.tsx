import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { getSavedPosts } from "@/lib/appwrite/api";
import { useGetCurrentUser } from "@/lib/react-query//queriesAndMutations";
import { Models } from "appwrite";
import { useEffect, useState } from "react";

export const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [savedPosts, setSavedPosts] = useState<Models.Document[]>([]);
  useEffect(() => {
    (async () => {
      const saves = await getSavedPosts(currentUser?.$id as string);
      if (saves?.length) {
        const posts = saves?.map((save) => save?.post);
        setSavedPosts(posts || []);
      }
    })();
  }, [currentUser?.$id]);
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts?.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList
              posts={savedPosts}
              showStats={false}
              showUser={false}
            />
          )}
        </ul>
      )}
    </div>
  );
};
