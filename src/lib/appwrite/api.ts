import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appWriteConfig, avatars, databases, storage } from "./config";
import { URL } from "url";
type userDB = {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
};
// ------> Auth
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    // check if there is a newAccount created from appwrite auth
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    // save in DB
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    });
    return newUser;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export const saveUserToDB = async (user: userDB) => {
  try {
    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersColectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (err) {
    console.log(err);
  }
};
export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (err) {
    console.log(err);
  }
};
// get the current account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}
// sign out
export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
};
// ------> post
export const createPost = async (post: INewPost) => {
  try {
    // upload the file to appwrite storage
    const uploadedFile = await uploadFile(post?.file?.[0]);
    if (!uploadedFile) throw Error;
    // get the file url
    const fileUrl = getFileUrl(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    // make an array of the tags
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    // create a new post
    const newPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
};
export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};
export const getFileUrl = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000,
      2000,
      "center",
      100
    );
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appWriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
// get recent posts
export const getRecentPosts = async () => {
  const posts = await databases.listDocuments(
    appWriteConfig.databaseId,
    appWriteConfig.postsColectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
};
export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};
export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesColectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};
export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesColectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};
export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      postId
    );
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
};
export const updatePost = async (post: IUpdatePost) => {
  const isFileChanged = post?.file?.length > 0;
  try {
    let image = { imageUrl: post.imageUrl, imageId: post.imageId };
    if (isFileChanged) {
      // upload the file to appwrite storage
      const uploadedFile = await uploadFile(post?.file?.[0]);
      if (!uploadedFile) throw Error;
      // get the file url
      const fileUrl = getFileUrl(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    // make an array of the tags
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    // update the post post
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      // delete the new file from the storage
      if (isFileChanged) {
        await deleteFile(post.imageId);
      }
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (
  postId: string,
  imageId: string,
  savedRecordIds: string[]
) => {
  if (!postId || !imageId) throw Error;
  try {
    if (savedRecordIds.length > 0) {
      await deleteAllSavedRecord(savedRecordIds);
    }
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      postId
    );
    if (!statusCode) throw Error;
    await deleteFile(imageId);
    return statusCode;
  } catch (error) {
    console.log(error);
  }
};
export const getInfintePosts = async ({
  pageParams,
}: {
  pageParams: number;
}) => {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParams) {
    queries.push(Query.cursorAfter(pageParams.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
};
export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postsColectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
};
// ------> users
export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersColectionId,
      [Query.equal("accountId", currentAccount?.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
export async function getUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersColectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersColectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFileUrl(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersColectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
// -----> saved posts
export const getSavedPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.savesColectionId,
      [Query.equal("user", userId)]
    );
    return posts.documents || null;
  } catch (error) {
    console.log(error);
  }
};
const deleteAllSavedRecord = async (savedRecordsIds: string[]) => {
  try {
    savedRecordsIds?.forEach(async (id) => {
      await databases.deleteDocument(
        appWriteConfig.databaseId,
        appWriteConfig.savesColectionId,
        id
      );
    });
  } catch (error) {
    console.log(error);
  }
};